import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import styled from "styled-components";
import { useZakeke } from "@zakeke/zakeke-configurator-react";
import { ListItem, ListItemImage } from "./list";
import "./selector.css";
import "./Menu/menu.css";
import { Dialog, useDialogManager } from "../components/dialogs/Dialogs";
import ErrorDialog from "../components/dialogs/ErrorDialog";
import ArDeviceSelectionDialog from "../components/dialogs/ArDeviceSelectionDialog";
import Cameras from "./Cameras/Cameras";
import Preview from "./Preview/Preview";
import SvgArrowDown from "../icons/Arrowdown";
import Loader from "../components/Loader/Loader";
import Scroll from "./Scroll/Scroll";
import SelectionIcon from "../icons/SelectionIcon";
import ExplodeSolid from "../assets/icons/expand-arrows-alt-solid.js";

import { ExplodeIconL } from "../assets/icons/ExplodeIcon";
import Reset from "../assets/icons/reset.jpg";
import PrintIcon from "../assets/icons/print.jpg";
import { Icon } from "./Atomic";
import MenuFooter from "./Footer/MenuFooter";
import Designer from "./layout/tdesigner";
import { ReactComponent as CrossIcon } from "../assets/icons/cross.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";
// import { customizeGroup } from "../Helpers";
import { AiIcon, ArIcon } from "./layout/tlayoutStyles";

// import {
//   PRODUCT_FULL_SUIT,
//   PRODUCT_BLAZER,
//   PRODUCT_PANT,
//   scrollDownOnClick,
// } from "../../Helpers";
import Zoom from "./Zoom/Zoom";
import ShareDialog from "./dialogs/ShareDialog";
import { PRODUCT_FULL_SUIT, scrollDownOnClick } from "../Helpers";
import { useActualGroups } from "helper";
import textIcon from '../../assets/icons/font-solid.svg';
import savedCompositionsIcon from '../../assets/icons/saved_designs.svg';
import star from '../../assets/icons/star.svg';
import { FullScreen } from "assets/icons/fullScreen";
import { EyeIcon } from "assets/icons/eyeIcon";
import ShareIcon from "assets/icons/ShareIcon";
const Container = styled.div`
  height: auto;
  // overflow: auto;
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;

  @media (max-width: 768px) {
    height: auto;
    // overflow: auto;
  }
`;

export const ExplodeIcon = styled(Icon)`
  width: 32px;
  height: 32px;
`;

interface SelectorProps {
  refViewer: any; // React.RefObject<HTMLElement>;
  fullScreen: any;
}

const Selector: FunctionComponent<SelectorProps> = ({
  refViewer,
  fullScreen,
}) => {
  const {
    isSceneLoading,
    groups,
    selectOption,
    setCamera,
    setCameraByName,
    setExplodedMode,
    zoomIn,
    zoomOut,
    product,
    IS_IOS,
    IS_ANDROID,
    sellerSettings,
    reset,
    getMobileArUrl,
    openArMobile,
    isSceneArEnabled,
    productName,
  } = useZakeke();

  const { showDialog, closeDialog } = useDialogManager();

  const idsToRemove = [-1];

  // idsToRemove.push(10640); // id to remove on only blazer product

  // const groups1 = groups.filter((obj) => !idsToRemove.includes(obj.id));
  const groups1 = useActualGroups();
  // if (product?.name != PRODUCT_PANT) groups1.push(customizeGroup);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Keep saved the ID and not the refereces, they will change on each update
  const [isRecapPanelOpened, setRecapPanelOpened] = useState(
    sellerSettings?.isCompositionRecapVisibleFromStart ?? false
  );
  const [selectedGroupId, selectGroup] = useState<number | null>(null);
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedStepName, selectStepName] = useState<string | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);
  const [selectedAttributeOptionName, setSelectedAttributeOptionName] =
    useState<string | null>(null);
  const [selectedOptionName, selectOptionName] = useState<string | null>(null);

  const [selectedLiningTypeHeadName, selectLiningTypeHeadName] = useState<
    string | null
  >(null);
  const [selectedLiningTypeName, selectLiningTypeName] = useState<
    string | null
  >(null);

  const [selectedExplodedState, setSelectedExplodedStatese] = useState<
    boolean | null
  >(false);

  const [selectedCameraID, setSelectedCameraID] = useState<string | null>(null);
  const [selectedCameraAngle, setSelectedCameraAngle] = useState<string | null>(
    null
  );
  const [previewImage, setPreviewImage] = useState<any | null>(null);

  const [selectedCollapse, selectCollapse] = useState<boolean | null>(null); // This is the small inner icons
  const [isLoading, setIsLoading] = useState<boolean | null>(false);
  const [checkOnce, setCheckOnce] = useState<boolean | null>(true);

  const [closeAttribute, setCloseAttribute] = useState<boolean | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [resetCameraID, setResetCameraID] = useState<string | null>(null);
  const viewFooter = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sellerSettings && sellerSettings?.isCompositionRecapVisibleFromStart)
      setRecapPanelOpened(sellerSettings.isCompositionRecapVisibleFromStart);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerSettings]);

  var selectedGroup = groups1.find((group) => group.id === selectedGroupId);
  var selectedStep = selectedGroup
    ? selectedGroup.steps.find((step) => step.id === selectedStepId)
    : null;

  // Attributes can be in both groups1 and steps, so show the attributes of step or in a group based on selection
  const attributes = useMemo(
    () => (selectedStep || selectedGroup)?.attributes ?? [],
    [selectedGroup, selectedStep]
  );

  const handleStepClick = useCallback((step: any) => {
    selectStepName(step.name);
    selectStep(step.id);
    selectOptionName("");
  }, [selectStepName, selectStep, selectOptionName]);

  const handleOptionClick = useCallback((attribute: any) => {
    console.log(`Selected Attribute: ${attribute.name}`);
    selectOption(attribute.id);
    selectOptionName(attribute.name);
    console.log("Groups after option selection:", groups1)
  }, [selectOption, selectOptionName, groups1]);



  // Updated filteredAttributes to remove group-specific logic
  const filteredAttributes = useMemo(() => {
    if (!selectedGroup?.attributes) return [];

    // Only filter based on enabled attributes, no group-specific logic
    return selectedGroup.attributes.filter((step) => step.enabled);
  }, [selectedGroup]);

  // const handleArClick = async (arOnFlyUrl: string) => {
  //   if (IS_ANDROID || IS_IOS) {
  //     setIsLoading(true);
  //     const link = new URL(arOnFlyUrl, window.location.href);
  //     const url = await getMobileArUrl(link.href);
  //     setIsLoading(false);
  //     if (url)
  //       if (IS_IOS) {
  //         openArMobile(url as string);
  //       } else if (IS_ANDROID) {
  //         showDialog(
  //           "open-ar",
  //           <Dialog>
  //             <button
  //               style={{ display: "block", width: "100%" }}
  //               onClick={() => {
  //                 closeDialog("open-ar");
  //                 openArMobile(url as string);
  //               }}
  //             >
  //               See your product in AR
  //             </button>
  //           </Dialog>
  //         );
  //       }
  //   } else {
  //     showDialog("select-ar", <ArDeviceSelectionDialog />);
  //   }
  // };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [groups]);

  useEffect(() => {
    const previewImage = attributes.forEach((attr) => {
      attr.options.forEach((option) => {
        if (option.selected && !!option.imageUrl) {
          let Previewdata = {
            image: option.imageUrl,
            optionName: option.id,
            attributeName: attr.id,
            stepName: attr.name,
            groupName: attr.code,
          };

          setPreviewImage(Previewdata);
        }

        if (selectedStepName === "LINING TYPE") {
          groups[1].steps[3].attributes[0].options.map((x) => {
            if (x.selected === true) selectLiningTypeName(x.name);
          });

          if (selectedLiningTypeName === "Stretch") {
            groups[1].steps[3].attributes[1].options.map((x) => {
              if (x.selected === true) {
                let Previewdata = {
                  image: x.imageUrl,
                  optionName: x.id,
                  attributeName: attr.id,
                  stepName: attr.name,
                };

                setPreviewImage(Previewdata);
              }
            });
          }
        }
      });
    });
  }, [
    attributes,
    selectedGroup,
    selectedAttributeId,
    selectedCameraID,
    selectedLiningTypeHeadName,
    selectedLiningTypeName,
  ]);

  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  // Open the first group and the first step when loaded
  useEffect(() => {
    if (!selectedGroup && groups1.length > 0 && groups1[0].id != -2) {
      selectGroup(groups1[0].id);

      if (groups1[0].steps.length > 0) selectStep(groups1[0].steps[0].id);
    }
  }, [selectedGroup, groups1]);

  // Select attribute first time
  useEffect(() => {
    if (!selectedAttribute && attributes.length === 1)
      selectAttribute(attributes[0]?.id);

    setSelectedAttributeOptionName(
      selectedAttribute && selectedAttribute.options
        ? selectedAttribute.options.find((x) => x.selected === true)?.name ||
        null
        : null
    );
    if (groups && !selectedAttribute) {
      setResetCameraID(groups[0]?.cameraLocationId);
    }
  }, [selectedAttribute, attributes]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;

      if (camera) setCamera(camera);
    }
  }, [selectedGroupId]);

  // Camera for left icons
  useEffect(() => {
    if (selectedCameraID) setCamera(selectedCameraID);

    setSelectedCameraID("");
  }, [selectedCameraID]);

  // Camera for attributes
  useEffect(() => {
    if (
      !isSceneLoading &&
      selectedAttribute &&
      selectedAttribute.cameraLocationId
    ) {
      setCamera(selectedAttribute.cameraLocationId);
    }
  }, [selectedAttribute, !isSceneLoading]);

  if (isSceneLoading || !groups1 || groups1.length === 0 || isLoading)
    return <Loader visible={true} />;

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleShareClick = async () => {
    setCameraByName('buy_screenshot_camera', false, false);
    showDialog('share', <ShareDialog />);
    togglePopup();
  };

  // console.log('wwwwwwwwww', selectedGroupId)
  // console.log('first', groups1)

  const handlePrint = () => {
    const canvas = document.querySelector("canvas");

    if (canvas) {
      const originalDimensions = {
        width: canvas.width,
        height: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height,
      };

      const adjustViewerForPrint = () => {
        canvas.style.width = '829px';
        canvas.style.height = '608px';
        return originalDimensions;
      };

      const restoreViewerAfterPrint = (originalDimensions: any) => {
        canvas.width = originalDimensions.width;
        canvas.height = originalDimensions.height;
        canvas.style.width = originalDimensions.styleWidth;
        canvas.style.height = originalDimensions.styleHeight;
      };

      const originalDimensions_save = adjustViewerForPrint();
      window.print();
      restoreViewerAfterPrint(originalDimensions_save);
    }

    togglePopup();
  };

  return (
    <Container>
      {/* <div className="app">
        <button className="menu-button" onClick={togglePopup}>
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 12C1 11.4477 1.44772 11 2 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H2C1.44772 13 1 12.5523 1 12Z" fill="#0F0F0F"></path> <path d="M1 4C1 3.44772 1.44772 3 2 3H22C22.5523 3 23 3.44772 23 4C23 4.55228 22.5523 5 22 5H2C1.44772 5 1 4.55228 1 4Z" fill="#0F0F0F"></path> <path d="M1 20C1 19.4477 1.44772 19 2 19H22C22.5523 19 23 19.4477 23 20C23 20.5523 22.5523 21 22 21H2C1.44772 21 1 20.5523 1 20Z" fill="#0F0F0F"></path> </g></svg>
        </button>
      </div> */}

      <div
        className="left-keys"
      >


        <div className="viewer_zoom">
          <Zoom zoomIn={zoomIn} zoomOut={zoomOut} />
          <div className="full_screen" onClick={fullScreen} style={{}}>
            <FullScreen />
            <div className="ff_zoom_description">Full screen</div>
          </div>
        </div>

        <div className="share_button">
          <div className="" style={{ cursor: 'pointer' }}>
            <EyeIcon />
          </div>
          <div className="" style={{ cursor: 'pointer' }} onClick={handleShareClick}>
            <ShareIcon />
          </div>
        </div>

        <Scroll upRef={refViewer.current} downRef={viewFooter.current} />
      </div>

      <div className="" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '12px' }}>



        <div className="menu">

          <div className="" style={{
            background: "white", padding: "20px 18px", border: 'none',
            height: '100%',
            overflowY:"auto",
            borderRadius: '18px 18px 18px 0px'
          }}>
            <div className="menu_group">
              {groups1.map((group) => {
                const handleGroupClick = (group: any) => {
                  selectGroup(group.id);
                };

                return (
                  <div
                    className={`menu_item ${group.id === selectedGroupId ? "selected" : ""}`}
                    key={group.id}

                    onClick={() => {
                      scrollDownOnClick(checkOnce, setCheckOnce);
                      handleGroupClick(group);
                    }}
                  >
                    {group.id === -2 ? "Customize" : group.name}
                  </div>
                );
              })}
            </div>
            {selectedGroup && (
              <>
                {filteredAttributes.map((step) => {
                  const normalizedStepName = String(step.name).trim().toUpperCase();
                  const isSpecialStep = [
                    "UNITS",
                  ].includes(normalizedStepName);
                  const isNoBorderStep = normalizedStepName.includes(normalizedStepName);
                  const isShadeSize = normalizedStepName === "SHADE SIZE";

                  return (
                    <div
                      className="menu_choice_step_step"
                      key={step.id}
                      onClick={() => handleStepClick(step)}
                    >
                      <div
                        className="menu_choice_step_title"
                        style={{
                          display: "flex",
                          // borderBottom: selectedStepId !== step.id || !closeAttribute ? "1px solid var(--template-primary--400)" : "",
                        }}
                      >
                        {/* <div
                          className="menu_choice_step_description"
                          onClick={() => setCloseAttribute(true)}
                          style={{
                            padding: " 1em .5em",
                            marginRight: "auto",
                            textTransform: "uppercase",
                          }}
                        >
                          {step.name}
                        </div> */}
                        {/* <div
                          className="menu_choice_step_toggle"
                          style={{
                            textAlign: 'right',
                            display: "flex",
                            paddingBottom: ".5em",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: "600",
                            lineHeight: "16px",
                            textTransform: "uppercase",
                            color: "#b4b5b8",
                            cursor: "pointer",
                          }}
                          onClick={() => setCloseAttribute(!closeAttribute)}
                        >
                          {step.options.some((option) => option.selected)
                            ? step.options.find((option) => option.selected)?.name
                            : "Select Option"}

                          <div style={{ marginLeft: "8px", display: "flex", alignItems: "center" }}>
                            {closeAttribute && step.id === selectedStepId ? (
                              <svg height="12px" width="12px" viewBox="0 0 125.304 125.304" fill="#000000">
                                <g transform="rotate(270, 62.652, 62.652)">
                                  <polygon points="21.409,62.652 103.895,125.304 103.895,0"></polygon>
                                </g>
                              </svg>
                            ) : (
                              <svg height="12px" width="12px" viewBox="0 0 125.304 125.304" fill="#000000">
                                <g transform="rotate(180, 62.652, 62.652)">
                                  <polygon points="21.409,62.652 103.895,125.304 103.895,0"></polygon>
                                </g>
                              </svg>
                            )}
                          </div>
                        </div> */}
                      </div>

                      <div
                        className="menu_options"
                        style={{
                          opacity: 1,
                          // transform: closeAttribute && step.id === selectedStepId ? "translateY(0)" : "translateY(-10px)",
                          overflow: "hidden",
                          transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                          // transitionDelay: closeAttribute && step.id === selectedStepId ? "0.2s" : "0s",
                        }}
                      >

                        {/* {closeAttribute && step.id === selectedStepId && ( */}
                        <>

                          {Array.from(new Map(step.options.map((attribute) => [attribute.id, attribute])).values())
                            .filter((attribute) => attribute.enabled !== false)
                            .map((attribute) => (
                              <div className="">
                                <ListItem
                                  key={attribute.id}
                                  onClick={() => handleOptionClick(attribute)}
                                  selected={attribute.selected}
                                  style={{
                                    backgroundColor: attribute.selected ? "#F2F2F2" : "white",
                                    color: attribute.selected ? "inherit" : "inherit",
                                    borderRadius: "11px",
                                    border: attribute.selected ? "2px solid #FF5733" : "2.5px solid lightGray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    fontWeight: isShadeSize ? "600" : "600",
                                    fontSize: isShadeSize ? "26px !important" : "auto",
                                    height: isShadeSize ? "85px" : "auto",
                                    width: attribute.name === "Units" ? "auto" : "",
                                    textAlign: isShadeSize ? "center" : "inherit",
                                  }}
                                >
                                  {isSpecialStep ? (
                                    <div
                                      className="menu_choice_option_description"
                                      style={{
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "8px 18px",
                                        fontWeight: '600',
                                        fontSize: isShadeSize ? "26px" : "15px",
                                        textAlign: isShadeSize ? "center" : "inherit",
                                      }}
                                    >
                                      
                                      {isShadeSize  ? attribute.name.replace(/[a-zA-Z]/g, "") : attribute.name}
                                    </div>
                                  ) : (
                                    <div className="menu_choice_option_image_container">
                                      {attribute.imageUrl && <ListItemImage src={attribute.imageUrl} />}
                                    </div>
                                  )}


                                  {/* {!isSpecialStep && attribute.selected && (
                                    <div
                                      className="backgroundSvg"
                                      style={{
                                        position: "absolute",
                                        borderRadius: "8px",
                                        backgroundColor: "rgb(121 136 156)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                        <path
                                          d="M20 6L9 17L4 12"
                                          stroke="white"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  )} */}
                                </ListItem>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: attribute.selected ? "#FF5733" : "#434342",
                                    textAlign: "center",
                                  }}
                                >
                                  {attribute.name}
                                </div>
                              </div>
                            ))}


                        </>

                        {/* )} */}
                      </div>

                    </div>
                  );
                })}
              </>
            )}
            {selectedGroupId === -2 && <Designer />}

            <div className="share_button_desktop">
              <div className="" style={{ cursor: 'pointer' }}>
                <EyeIcon />
              </div>
              <div className="" style={{ cursor: 'pointer' }} onClick={handleShareClick}>
                <ShareIcon />
              </div>
            </div>
          </div>
          <br />

          <div className="" style={{ marginTop: '24px' }}>
            {screenWidth < 500 && <MenuFooter viewFooter={viewFooter} />}
          </div>
        </div>
        {screenWidth > 500 && (
          <div className="" style={{ marginTop: '7px' }}>
            <MenuFooter viewFooter={viewFooter} />
          </div>
        )}
      </div>
    </Container >
  );
};

export default Selector;