import { ToolTitle } from '../../config'
import { PlatformRoute } from '../../lib'

import { Account } from './account'
import Settings from './Settings'

export const settingsRoutes: Array<PlatformRoute> = [
    {
        children: [
            {
                children: [],
                element: <Account />,
                enabled: true,
                route: '',
                title: ToolTitle.settings,
            },
        ],
        element: <Settings />,
        enabled: true,
        route: '/self-service/account',
        title: ToolTitle.settings,
    },
]
