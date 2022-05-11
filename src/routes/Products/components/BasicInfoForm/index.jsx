/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Basic Info Form component
 */
import FormField from "components/FormElements/FormField";
import FormInputText from "components/FormElements/FormInputText";
import Button from "components/Button";
import HelpBanner from "components/HelpBanner";
import PageDivider from "components/PageDivider";
import PageP from "components/PageElements/PageP";
import PageRow from "components/PageElements/PageRow";
import RadioButton from "components/RadioButton";
import FormInputTextArea from "components/FormElements/FormInputTextArea";
import ServicePrice from "components/ServicePrice";
// TODO: Move this component to /components
import ColorOptions from "../../../Branding/components/ColorOptions";
import { HELP_BANNER } from "constants/";
import PT from "prop-types";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import DataExplorationIcon from "../../../../assets/images/data-exploration-icon.svg";
import FindMeDataIcon from "../../../../assets/images/find-me-data-icon.svg";
import WebsiteDesignIcon from "../../../../assets/images/website-design-icon.svg";
import "./styles.module.scss";
import {
  PrimaryDataChallengeOptions,
  BUTTON_SIZE,
  BUTTON_TYPE,
  ColorOptionsItems,
} from "../../../../constants";
import StyleOptions from "../StyleOptions";

const BasicInfoForm = ({
  formData,
  serviceType,
  onFormUpdate,
  onShowSupportModal,
  estimate,
  bannerData,
}) => {
  const handleInputChange = (name, value, option = "") => {
    onFormUpdate({ ...formData, [name]: { ...formData[name], option, value } });
  };
  const [primaryDataChallenge, setPrimaryDataChallenge] = useState(
    PrimaryDataChallengeOptions
  );
  const [selectedColor, setSelectedColor] = useState({});

  const {
    title,
    helperBannerTitle,
    helperBannerContent,
    aboutBannerTitle,
    aboutBannerContent,
  } = bannerData;

  const isDataExploration = title === "Data Exploration";
  const isFindMeData = title === "Find Me Data";
  const isWebsiteDesign = title === "Website Design";
  const isOtherOptionSelected = formData?.primaryDataChallenge?.value !== 3;

  const handleArrayInputChange = (index, name, key, value, option = null) => {
    onFormUpdate((formData) => {
      const newFormData = {
        ...formData,
      };

      if (!newFormData[name]) {
        newFormData[name] = [
          {
            website: { name, value, option: option ? option : value },
            feedback: { name, value, option: option ? option : value },
          },
        ];
      }

      newFormData[name][index][key] = {
        name,
        value,
        option: option ? option : value,
      };

      return newFormData;
    });
  };

  const addWebsite = () => {
    onFormUpdate((formData) => {
      const newFormData = {
        ...formData,
        inspiration: [
          ...(formData.inspiration || []),
          {
            website: { name: "Website", value: "", option: "" },
            feedback: { name: "Feedback", value: "", option: "" },
          },
        ],
      };

      return newFormData;
    });
  };

  const removeWebsite = (index) => {
    onFormUpdate((formData) => {
      const newFormData = {
        ...formData,
      };
      newFormData.inspiration.splice(index, 1);

      return newFormData;
    });
  };

  useEffect(() => {
    const itemSelected = formData?.primaryDataChallenge;

    if (itemSelected?.option && primaryDataChallenge[0]) {
      const newDeliverableOptions = primaryDataChallenge.map((o) => {
        o.value = o.label === itemSelected.option;
        return o;
      });
      setPrimaryDataChallenge(newDeliverableOptions);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.primaryDataChallenge]);

  useEffect(() => {
    if (
      isOtherOptionSelected &&
      formData?.primaryDataChallengeOther?.value?.trim().length
    ) {
      handleInputChange("primaryDataChallengeOther", "", "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryDataChallenge, setPrimaryDataChallenge]);

  let servicePriceIcon;
  switch (title) {
    case "Data Exploration":
      servicePriceIcon = <DataExplorationIcon />;
      break;
    case "Finde Me Data":
      servicePriceIcon = <FindMeDataIcon />;
      break;
    case "Website Design":
      servicePriceIcon = <WebsiteDesignIcon />;
      break;
    default:
      break;
  }

  let titleValue;
  switch (title) {
    case "Data Exploration":
      titleValue = formData.projectTitle.value;
      break;
    case "Find Me Data":
      titleValue = formData.findMeProjectTitle.value;
      break;
    case "Website Design":
      titleValue = formData.projectTitle.value;
    default:
      break;
  }

  let dataName;
  if (isDataExploration || isWebsiteDesign) {
    dataName = "projectTitle";
  } else if (isFindMeData) {
    dataName = "findMeProjectTitle";
  }

  return (
    <div styleName="basicInfoForm">
      <ServicePrice
        price={estimate?.total}
        stickerPrice={estimate?.stickerPrice}
        duration={estimate?.totalDuration}
        serviceType={serviceType}
        hideTitle
        showIcon
        icon={servicePriceIcon}
      />
      <HelpBanner defaultOpen title={helperBannerTitle} styles={["gray"]}>
        {helperBannerContent}
      </HelpBanner>

      <HelpBanner title={aboutBannerTitle} styles={["turqoise"]}>
        {aboutBannerContent}
      </HelpBanner>

      <PageDivider />

      <PageRow styleName="form-row">
        <div>
          <PageP styleName="title">PROJECT TITLE</PageP>
          <PageP styleName="description">
            Give your project a descriptive title. This is what the data
            scientists will see when looking for your work.
          </PageP>
        </div>

        <div styleName="formFieldWrapper">
          <FormField label={"Project Title"}>
            <FormInputText
              placeholder={"Enter a descriptive title"}
              value={titleValue}
              name={dataName}
              onChange={(e) =>
                handleInputChange(e.target.name, e.target.value, e.target.value)
              }
            />
          </FormField>
        </div>
      </PageRow>

      {isDataExploration && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">Share Your Data (optional)</PageP>
            <PageP styleName="description">
              Add links (separate multiple links with commas) or upload your
              data files here. Not ready or able to share? No problem, we'll
              work with you on that later.
            </PageP>
          </div>

          <div styleName="formFieldWrapper">
            <div styleName="assets">
              <FormField label={"Shareable URL Link(s)"}>
                <FormInputText
                  placeholder={"www.example-share-link.com"}
                  value={formData?.assetsUrl?.value}
                  name="assetsUrl"
                  onChange={(e) =>
                    handleInputChange(
                      e.target.name,
                      e.target.value,
                      e.target.value
                    )
                  }
                />
              </FormField>
            </div>
          </div>
        </PageRow>
      )}

      {isFindMeData && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">{"What Data Do You Need?"}</PageP>
            <PageP styleName="description">
              Briefly describe the analysis you want to do, and the type of data
              you're looking for to do it. Be sure to include any critical data
              requirements, such as specific geographies, demographics, date
              ranges and/or key variables needed for your analysis.{" "}
            </PageP>
            <HelpBanner title="Example" styles={["gray"]}>
              <br />
              <PageP>
                I'm a real estate investor & want to diversify into other cities
                in Texas. Currently, we only invest in Dallas Fort Worth. We're
                looking for 3-5 other cities in Texas to invest. I'd like to
                evaluate rental demand and occupancy rates, property price vs.
                avg rental payments, job and population growth compared to state
                and national averages, and the trends of renter-occupied
                households compared to homeowners. I think there's data on sites
                like{" "}
                <a target="_blank" href="https://www.zillow.com/">
                  {" "}
                  zillow.com
                </a>{" "}
                and{" "}
                <a target="_blank" href="https://www.hotpads.com/">
                  {" "}
                  hotpads.com
                </a>
                , but it's hard to find and organize.
              </PageP>
              <br />
              <PageP>
                Not sure what data you need? Consider{" "}
                <a target="_blank" href="https://topcoder.com">
                  {" "}
                  Problem Statement & Data Advisory
                </a>{" "}
                to get clarity on the best data & approach for your goals.
              </PageP>
            </HelpBanner>
          </div>

          <div styleName="formFieldWrapper">
            <FormField label={"Analysis & Data Description"}>
              <FormInputTextArea
                value={formData?.analysis?.value}
                onChange={(e) =>
                  handleInputChange(
                    e.target.name,
                    e.target.value,
                    e.target.value
                  )
                }
                styleName={"text-area"}
                name="analysis"
                placeholder={
                  "Describe your analysis goal and data requirements"
                }
              />
            </FormField>
          </div>
        </PageRow>
      )}

      {isWebsiteDesign && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="description">
              What is the purpose of your website? What do you want visitors to
              be able to do, e.g., see your work? contact you? You should
              include a general description as well as goals of the website. You
              You may also describe your audience and what you would like them
              to do at your website.{" "}
            </PageP>
            <HelpBanner title="Example" styles={["gray"]}>
              <br />
              <PageP>
                <PageP>
                  I would like a design for a dog walking website that allows
                  visitors to select dog walkers and schedule dog walking
                  appointments.
                </PageP>
                <PageP>
                  The audience for my website will be dog owners. As a dog
                  owner, I want someone trustworthy to walk my dog, so he feels
                  loved while I’m at work.
                </PageP>
                <PageP>
                  Home Page:
                  <br />I would like to see a landing screen to welcome our
                  customers and make them feel welcome and warm. We love their
                  dog and we want them to feel it! We really want our audience
                  to do one core action and that’s to get started finding their
                  perfect “Walkie” which is what we call our professional dog
                  walkers.
                </PageP>
                <PageP>
                  Information Pages:
                  <br />
                  Our customers should be able to reach information about: Our
                  Services, Our Walkies, and Locations We Serve. Also, a user
                  must be able to Create an Account.
                </PageP>
                <PageP>
                  Our Services include: dog walking, doggie day care, dog
                  feeding, basic grooming.
                </PageP>
                <PageP>
                  Our Walkies information should show a photo of the Walkie,
                  their name and a little bit about them. It’s important for
                  customers to see a badge of some sort that indicates all of
                  our dog walkers are insured.
                </PageP>
                <PageP>
                  Locations We Serve: We have 3 locations in the greater Seattle
                  area.
                </PageP>
                <PageP>
                  Each page should include a testimonial from one of our users.
                  For example: “WalkieDoggie is perfect. They are always
                  professional and they take amazing care of our dog, Beefcake.
                  - Victoria B. from Tacoma, Washington”
                </PageP>
              </PageP>
            </HelpBanner>
          </div>

          <div styleName="formFieldWrapper">
            <FormField label={"Description"}>
              <FormInputTextArea
                value={formData?.analysis?.value}
                onChange={(e) =>
                  handleInputChange(
                    e.target.name,
                    e.target.value,
                    e.target.value
                  )
                }
                styleName={"text-area"}
                name="analysis"
                placeholder={"Describe your website"}
              />
            </FormField>
          </div>
        </PageRow>
      )}

      <PageDivider />

      {isDataExploration && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">{"what would you like to learn?"}</PageP>
            <PageP styleName="description">
              Describe your data and what you would like to learn about it. If
              you have a formal problem statement, please share it.
            </PageP>
            <HelpBanner title="Example" styles={["gray"]}>
              <br />
              <PageP>
                I spend money on marketing for my website, but it's hard to know
                which marketing option works best. I make money from
                advertising, so the more people that visit my site and engage
                with something, the more ad money I can make. I shared the
                reports I have from the past year for each of my 3 marketing
                channels. I'd like to know how that data can help understand
                where to focus my marketing spend.
              </PageP>
            </HelpBanner>
          </div>

          <div styleName="formFieldWrapper">
            <FormField label={"Goals & Data Description"}>
              <FormInputTextArea
                value={formData?.goals?.value}
                onChange={(e) =>
                  handleInputChange(
                    e.target.name,
                    e.target.value,
                    e.target.value
                  )
                }
                styleName={"text-area"}
                name="goals"
                placeholder={"Enter your goals and descriptions here"}
              />
            </FormField>
          </div>
        </PageRow>
      )}

      {isFindMeData && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">{"Primary Data Challenge"}</PageP>
            <PageP styleName="description">
              Select the primary data challenge you're facing.
            </PageP>
          </div>

          <div styleName="formFieldWrapper">
            <RadioButton
              onChange={(items) => {
                const selectedOption = items.findIndex((item) => item.value);
                const foundOption = items.find((item) => item.value);
                handleInputChange(
                  "primaryDataChallenge",
                  selectedOption,
                  foundOption.label
                );
              }}
              size="lg"
              options={primaryDataChallenge}
            />
            <br />
            <FormField
              label={"Primary Data Challenge"}
              disabled={isOtherOptionSelected}
            >
              <FormInputText
                placeholder={"Specify your primary data challenge"}
                value={formData?.primaryDataChallengeOther?.value}
                name="primaryDataChallengeOther"
                onChange={(e) =>
                  handleInputChange(
                    e.target.name,
                    e.target.value,
                    e.target.value
                  )
                }
                disabled={isOtherOptionSelected}
              />
            </FormField>
          </div>
        </PageRow>
      )}

      {isWebsiteDesign && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">Your industry</PageP>
            <PageP styleName="description">
              Knowing your industry will help our designers understand you and
              For example, some common industries are: Business & Consulting,
              Construction, Entertainment & Arts, Healthcare, Retail, and
              Technology.
            </PageP>
          </div>

          <div styleName="formFieldWrapper">
            <div>
              <FormField label={"Your Industry"}>
                <FormInputText
                  placeholder={"Enter your industry"}
                  value={formData?.yourIndustry?.value}
                  name="yourIndustry"
                  onChange={(e) =>
                    handleInputChange(
                      e.target.name,
                      e.target.value,
                      e.target.value
                    )
                  }
                />
              </FormField>
            </div>
          </div>
        </PageRow>
      )}

      <PageDivider />

      {isFindMeData && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">Sample Data</PageP>
            <PageP styleName="description">
              Sample data helps us understand your data needs. Often this is a
              simple CSV/Excel table that shows the data labels (usually the
              title of each column or row) and two or more rows of example input
              data. Example: FName is a data label, 'Ankit' is input data.
            </PageP>
          </div>

          <div styleName="formFieldWrapper">
            <div styleName="assets">
              <FormField label={"Shareable URL Link(s)"}>
                <FormInputText
                  placeholder={"www.example-share-link.com"}
                  value={formData?.sampleData?.value}
                  name="sampleData"
                  onChange={(e) =>
                    handleInputChange(
                      e.target.name,
                      e.target.value,
                      e.target.value
                    )
                  }
                />
              </FormField>
            </div>
          </div>
        </PageRow>
      )}

      {isFindMeData && <PageDivider />}

      {isWebsiteDesign && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">inspiration</PageP>
            <PageP styleName="description">
              Are there websites that you love, from which our designers may
              draw inspiration? Share the website URLs and tell us what you like
              about them.
            </PageP>
          </div>

          <div styleName="formFieldWrapper">
            {_.map(_.get(formData, "inspiration", []), (entry, index) => (
              <div key={index}>
                {index ? (
                  <div
                    role="button"
                    tabIndex="0"
                    styleName="remove-website"
                    onClick={() => removeWebsite(index)}
                  >
                    Remove Website
                  </div>
                ) : null}
                <FormField label={"Website Address (optional)"}>
                  <FormInputText
                    placeholder={"Enter website url. e.g. www.acme.com"}
                    value={entry.website.value}
                    name="website"
                    onChange={(e) =>
                      handleArrayInputChange(
                        index,
                        "inspiration",
                        e.target.name,
                        e.target.value
                      )
                    }
                  />
                </FormField>
                <FormField label={"What Do You Like (optional)"}>
                  <FormInputTextArea
                    value={entry.feedback.value}
                    onChange={(e) =>
                      handleArrayInputChange(
                        index,
                        "inspiration",
                        e.target.name,
                        e.target.value
                      )
                    }
                    styleName={"text-area"}
                    name="feedback"
                    placeholder={"Describe what you like about this website"}
                  />
                </FormField>
              </div>
            ))}
            <Button
              type={BUTTON_TYPE.SECONDARY}
              size={BUTTON_SIZE.MEDIUM}
              onClick={addWebsite}
            >
              ADD ANOTHER WEBSITE
            </Button>
          </div>
        </PageRow>
      )}
      {isWebsiteDesign && <PageDivider />}
      {isWebsiteDesign && (
        <PageRow styleName="form-row">
          <PageP styleName="title">STYLE &amp; THEME</PageP>
        </PageRow>
      )}
      {isWebsiteDesign && (
        <PageRow styleName="form-row">
          <div styleName="formFieldWrapper style-picker">
            <PageP styleName="label">
              Let us know the visual styles you like or dislike (optional):
            </PageP>
            <div styleName="styles">
              <StyleOptions
                likes={formData?.likedStyles?.value}
                dislikes={formData?.dislikedStyles?.value}
                onLike={(likes) => {
                  handleInputChange("likedStyles", likes, likes);
                }}
                onDislike={(dislikes) => {
                  handleInputChange("dislikedStyles", dislikes, dislikes);
                }}
              />
            </div>
            <PageRow styleName="form-row">
              <div>
                <PageP styleName="label">
                  Additional details about your look & feel preferences:
                </PageP>
              </div>
              <div styleName="formFieldWrapper">
                <FormField label={`Style Preferences (optional)`}>
                  <FormInputTextArea
                    value={formData?.stylePreferences?.value}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                    styleName={"text-area"}
                    name="stylePreferences"
                    placeholder={"Describe your ideal look & feel"}
                  />
                </FormField>
              </div>
            </PageRow>
          </div>
        </PageRow>
      )}

      {isWebsiteDesign && (
        <PageRow styleName="form-row">
          <div styleName="formFieldWrapper color-picker">
            <PageP styleName="label">
              Choose colors you would like our designers to use in your site
              design:
            </PageP>
            <div styleName="colors">
              <ColorOptions
                colors={ColorOptionsItems}
                selectedColor={selectedColor}
                onSelect={(index, colorName) => {
                  setSelectedColor({ value: index });
                  handleInputChange("colorOption", index, colorName);
                }}
              />
            </div>
            <PageRow styleName="form-row">
              <div>
                <PageP styleName="label">
                  List any specific colors you would like used in your design:
                </PageP>
              </div>
              <div styleName="formFieldWrapper">
                <FormField
                  label={`List Specific Colors ${
                    selectedColor?.value?.length > 0 ? "(optional)" : ""
                  }`}
                >
                  <FormInputText
                    value={formData?.specificColor?.value}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                    styleName={"text-area"}
                    name="specificColor"
                    placeholder={
                      "Specify colors using their value in RGB, CMYK, or Hex"
                    }
                  />
                </FormField>
              </div>
            </PageRow>
          </div>
        </PageRow>
      )}

      <PageDivider />

      {isWebsiteDesign && (
        <PageRow styleName="form-row">
          <div>
            <PageP styleName="title">share your brand or style assets</PageP>
            <PageP styleName="description">
              If you have them, gather and upload any assets that you think
              might be helpful for our designers. Let us know if there is
              anything you would like to communicate about these items. <br />
              Assets could be:
              <ul styleName="list">
                <li>your logo</li>
                <li>your brand guide</li>
                <li>mood boards</li>
                <li>font files</li>
                <li>sketches or other inspiration</li>
              </ul>
            </PageP>
          </div>

          <div styleName="formFieldWrapper">
            <div styleName="assets">
              <FormField label={"Shareable URL Link(s)"}>
                <FormInputText
                  placeholder={"www.example-share-link.com"}
                  value={formData?.assetsUrl?.value}
                  name="assetsUrl"
                  onChange={(e) =>
                    handleInputChange(
                      e.target.name,
                      e.target.value,
                      e.target.value
                    )
                  }
                />
              </FormField>
              <FormField label={"About Your Assets (optional)"}>
                <FormInputTextArea
                  value={formData?.assetsDescription?.value}
                  onChange={(e) =>
                    handleInputChange(
                      e.target.name,
                      e.target.value,
                      e.target.value
                    )
                  }
                  styleName={"text-area"}
                  name="assetsDescription"
                  placeholder={"Describe what you would like us to know"}
                />
              </FormField>
            </div>
          </div>
        </PageRow>
      )}

      <HelpBanner
        title={HELP_BANNER.title}
        description={HELP_BANNER.description}
        contactSupport={onShowSupportModal}
      />
    </div>
  );
};

BasicInfoForm.defaultProps = {
  serviceType: "",
};

BasicInfoForm.propTypes = {
  estimate: PT.shape().isRequired,
  serviceType: PT.string,
  onFormUpdate: PT.func,
  formData: PT.shape(),
  bannerData: PT.shape().isRequired,
};

export default BasicInfoForm;