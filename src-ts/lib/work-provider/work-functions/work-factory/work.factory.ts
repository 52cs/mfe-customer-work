import moment from 'moment'

import * as DesignPrices from '../../../../../src/constants'
import * as DataPrices from '../../../../../src/constants/products/DataExploration'
import { Challenge, ChallengeMetadata, ChallengePhase, ChallengePhaseName } from '../work-store'

import { ChallengeStatus } from './challenge-status.enum'
import { WorkProgressStep } from './work-progress-step.model'
import { WorkProgress } from './work-progress.model'
import { WorkStatus } from './work-status.enum'
import { WorkType } from './work-type.enum'
import { Work } from './work.model'

export function create(challenge: Challenge): Work {

    const status: WorkStatus = getStatus(challenge)
    const submittedDate: Date | undefined = getSubmittedDate(challenge)
    const type: WorkType = getType(challenge)

    return {
        cost: getCost(challenge, type),
        created: submittedDate,
        description: getDescription(challenge, type),
        id: challenge.id,
        messageCount: Number((Math.random() * 10).toFixed(0)), // TODO: real message count
        participantsCount: challenge.numOfRegistrants,
        progress: getProgress(challenge, status),
        solutionsCount: challenge.numOfSubmissions,
        solutionsReadyDate: getSolutionsReadyDate(challenge),
        status,
        submittedDate,
        title: challenge.name,
        type,
    }
}

export function getStatus(challenge: Challenge): WorkStatus {

    switch (challenge.status) {

        case ChallengeStatus.new:
            return WorkStatus.draft

        case ChallengeStatus.active:
        case ChallengeStatus.approved:
        case ChallengeStatus.draft:
            return WorkStatus.active

        case ChallengeStatus.completed:
            const customerFeedback: ChallengeMetadata | undefined = findMetadata(challenge, 'customerFeedback')
            return !customerFeedback ? WorkStatus.ready : WorkStatus.done

        case ChallengeStatus.cancelled:
        case ChallengeStatus.cancelledPaymentFailed:
        case ChallengeStatus.cancelledRequirementsInfeasible:
            return WorkStatus.transferred

        default:
            return WorkStatus.deleted
    }
}

function findMetadata(challenge: Challenge, metadataName: string): ChallengeMetadata | undefined {
    return challenge.metadata?.find((item: ChallengeMetadata) => item.name === metadataName)
}

function findPhase(challenge: Challenge, phases: Array<string>): ChallengePhase | undefined {
    let phase: ChallengePhase | undefined
    let index: number = 0
    while (!phase && index < phases.length) {
        phase = challenge.phases.find((p: any) => p.name === phases[index])
        index++
    }
    return phase
}

function getCost(challenge: Challenge, type: WorkType): number | undefined {

    function getCountFromString(raw: string | undefined): number {
        return Number(raw?.split(' ')?.[0] || '0')
    }

    switch (type) {

        case WorkType.data:
            return DataPrices.PROMOTIONAL_PRODUCT_PRICE || DataPrices.BASE_PRODUCT_PRICE

        case WorkType.design:
            const pageCount: number = getCountFromString(findMetadata(challenge, 'basicInfo.numberOfPages')?.value)
            const deviceCount: number = getCountFromString(findMetadata(challenge, 'basicInfo.numberOfDevices')?.value)
            return DesignPrices.BASE_PRODUCT_PRICE +
                pageCount * DesignPrices.PER_PAGE_COST +
                pageCount * (deviceCount - 1) * DesignPrices.PER_PAGE_COST
    }
}

function getDescription(challenge: Challenge, type: WorkType): string | undefined {

    switch (type) {

        case WorkType.data:
            return findMetadata(challenge, 'goals')?.value

        case WorkType.design:
            return findMetadata(challenge, 'websitePurpose.description')?.value
    }
}

function getProgress(challenge: Challenge, workStatus: WorkStatus): WorkProgress {

    const steps: ReadonlyArray<WorkProgressStep> = [
        {
            date: getSubmittedDate(challenge),
            name: 'Submitted',
        },
        {
            date: getProgressStepDateStart(challenge, [ChallengePhaseName.registration]),
            name: 'Started',
        },
        {
            date: getProgressStepDateEnd(challenge, [
                ChallengePhaseName.approval,
                ChallengePhaseName.review,
                ChallengePhaseName.appeals,
                ChallengePhaseName.appealsResponse,
            ]),
            name: 'In Review',
        },
        {
            date: getSolutionsReadyDate(challenge),
            name: 'Solutions Ready',
        },
        {
            date: workStatus === WorkStatus.done && !!challenge.updated
                ? new Date(challenge.updated)
                : undefined,
            name: 'Done',
        },
    ]

    return {
        activeStepIndex: getProgressStepActive(challenge, workStatus),
        steps,
    }
}

function getProgressStepActive(challenge: Challenge, workStatus: WorkStatus): number {

    switch (challenge.status) {

        case ChallengeStatus.active:
            const submissionIsOpen: boolean = !!findPhase(challenge, [ChallengePhaseName.submission])?.isOpen
            const submissionEndDate: Date | undefined = getProgressStepDateEnd(challenge, [ChallengePhaseName.submission])
            return submissionIsOpen && new Date() > (submissionEndDate as Date) ? 1 : 2

        case ChallengeStatus.completed:
            return workStatus === WorkStatus.ready ? 3 : 4

        default:
            return 0
    }
}

function getProgressStepDateEnd(challenge: Challenge, phases: Array<string>): Date | undefined {

    const phase: ChallengePhase | undefined = findPhase(challenge, phases)
    if (!phase) {
        return undefined
    }

    if (phase.isOpen || moment(phase.scheduledStartDate).isAfter()) {
        return new Date(phase.scheduledEndDate)
    }

    return new Date(phase.actualEndDate || phase.scheduledEndDate)
}

function getProgressStepDateStart(challenge: Challenge, phases: Array<string>): Date | undefined {

    const phase: ChallengePhase | undefined = findPhase(challenge, phases)
    if (!phase) {
        return undefined
    }

    if (!phase.isOpen || moment(phase.scheduledStartDate).isAfter()) {
        return new Date(phase.scheduledStartDate)
    }

    return new Date(phase.actualStartDate)
}

function getSolutionsReadyDate(challenge: Challenge): Date | undefined {
    return getProgressStepDateEnd(challenge, [ChallengePhaseName.approval, ChallengePhaseName.appealsResponse])
}

function getSubmittedDate(challenge: Challenge): Date {
    return new Date(challenge.created)
}

function getType(challenge: Challenge): WorkType {

    // get the intake form from the metadata
    const intakeForm: ChallengeMetadata | undefined = findMetadata(challenge, 'intake-form')
    if (!intakeForm?.value) {
        return WorkType.unknown
    }

    // parse the form
    const form: {
        form: {
            workType: {
                selectedWorkTypeDetail: WorkType
            }
        }
    } = JSON.parse(intakeForm.value)

    const workTypeKey: (keyof typeof WorkType) | undefined = Object.entries(WorkType)
        .find(([key, value]) => value === form.form.workType?.selectedWorkTypeDetail)
        ?.[0] as keyof typeof WorkType

    const output: WorkType = !!workTypeKey ? WorkType[workTypeKey] : WorkType.unknown
    return output
}