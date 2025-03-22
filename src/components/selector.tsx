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
import ShareIcon from "../assets/icons/share.svg";
import { Icon } from "./Atomic";
import MenuFooter from "./Footer/MenuFooter";
import Designer from "./Layout/Designer";
import { ReactComponent as CrossIcon } from "../assets/icons/cross.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";
// import { customizeGroup } from "../Helpers";
import { AiIcon, ArIcon } from "../components/Layout/LayoutStyles";

// import {
//   PRODUCT_FULL_SUIT,
//   PRODUCT_BLAZER,
//   PRODUCT_PANT,
//   scrollDownOnClick,
// } from "../../Helpers";
import Zoom from "./Zoom/Zoom";
import ShareDialog from "./dialogs/ShareDialog";
import { PRODUCT_FULL_SUIT, scrollDownOnClick } from "../Helpers";

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

  const groups1 = groups.filter((obj) => !idsToRemove.includes(obj.id));

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
  }, [selectOption, selectOptionName]);

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
      <div className="app">
        <button className="menu-button" onClick={togglePopup}>
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 12C1 11.4477 1.44772 11 2 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H2C1.44772 13 1 12.5523 1 12Z" fill="#0F0F0F"></path> <path d="M1 4C1 3.44772 1.44772 3 2 3H22C22.5523 3 23 3.44772 23 4C23 4.55228 22.5523 5 22 5H2C1.44772 5 1 4.55228 1 4Z" fill="#0F0F0F"></path> <path d="M1 20C1 19.4477 1.44772 19 2 19H22C22.5523 19 23 19.4477 23 20C23 20.5523 22.5523 21 22 21H2C1.44772 21 1 20.5523 1 20Z" fill="#0F0F0F"></path> </g></svg>
        </button>

        {isPopupOpen && (
          <div className="popup">
            <button className="close-button" onClick={togglePopup}>
              X
            </button>
            <div className="popup-buttons">
              <button onClick={() => { if (resetCameraID) setCamera(resetCameraID)}} >Reset View</button>
              <button onClick={handlePrint}>Print Your Design</button>
              <button onClick={handleShareClick}>
                Share Your Design
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="" style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: '50%', gap: '22px' }}>
        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
              onClick={() => { if (resetCameraID) setCamera(resetCameraID) }}
            >
              <div className="bubble_button_button">
                <ExplodeIcon>
                  <svg
                    width="220"
                    height="220"
                    viewBox="16 16 110 110"
                    preserveAspectRatio="xMidYMid meet"
                    stroke="#838383"
                    stroke-width="24"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <g transform="translate(0, 150) scale(0.1, -0.1)">
                      <path
                        d="M705 1060 c-98 -16 -195 -62 -195 -92 0 -28 23 -31 61 -9 97 56 239 65 351 22 73 -28 156 -103 193 -174 l28 -53 -28 -53 c-38 -70 -121 -144 -193 -172 -45 -19 -77 -23 -152 -23 -127 0 -191 24 -274 106 -65 63 -65 61 -11 93 14 9 4 19 -65 68 -45 32 -85 55 -91 52 -11 -7 -12 -192 -1 -199 4 -2 18 2 32 9 23 12 28 10 86 -50 224 -230 603 -165 733 126 18 39 18 46 5 79 -76 183 -283 300 -479 270z"
                        fill="#838383"
                      />
                      <path
                        d="M709 821 c-21 -22 -29 -39 -29 -66 0 -48 44 -95 90 -95 46 0 90 47 90 95 0 27 -8 44 -29 66 -40 39 -82 39 -122 0z"
                        fill="#838383"
                      />
                    </g>
                  </svg>
                </ExplodeIcon>
              </div>

              <div className="bubble_button_text">Reset View</div>
            </div>
          )
        }

        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
              onClick={() => {
                refViewer.current?.requestFullscreen();

                if (refViewer.current?.webkitRequestFullscreen) {
                  refViewer.current.webkitRequestFullscreen();
                }

                const element = refViewer.current;

                if (element) {
                  if (element.requestFullscreen) {
                    // element.requestFullscreen();
                  } else if (element.webkitEnterFullscreen) {
                    element.webkitEnterFullscreen();
                  } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                  } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                  }
                }
              }}
            >
              <div className="bubble_button_button">
                <ExplodeIcon>
                  <ExplodeIconL />
                </ExplodeIcon>
              </div>

              <div className="bubble_button_text">Full Screen</div>
            </div>
          )
        }

        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
              onClick={() => handlePrint()}
            >
              <div className="bubble_button_button">
                <ExplodeIcon>
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#838383"
                    fill="#838383"
                    stroke-width=".2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M28,9H25V3H7V9H4a2,2,0,0,0-2,2V21a2,2,0,0,0,2,2H7v6H25V23h3a2,2,0,0,0,2-2V11A2,2,0,0,0,28,9ZM9,5H23V9H9ZM23,27H9V17H23Zm5-6H25V15H7v6H4V11H28Z" fill="#838383" stroke="#838383" />
                  </svg>
                </ExplodeIcon>
              </div>

              <div className="bubble_button_text">Print</div>
            </div>
          )
        }

        {
          !IS_IOS && (
            <div
              className="bubble_buttons"
              onClick={handleShareClick}
            >
              <div className="bubble_button_button">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="#838383"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 15v10a2 2 0 002 2h18a2 2 0 002-2v-10" />
                  <path d="M16 20V3.5" />
                  <path d="M22 9l-6-6-6 6" />
                </svg>
              </div>

              <div className="bubble_button_text">Share</div>
            </div>
          )
        }
      </div >

      <div
        className="left-keys"
      >
        <div className=""
          style={{}}
        >
          <div style={{ color: '#322332', gap: '2px', display: 'flex', flexDirection: 'column', marginTop: '4px' }}>
            <h1 style={{ fontFamily: "Crimson", fontSize: '38px', fontWeight: 400, margin: '2px' }}>
              The Original<sup style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Open Sans', position: 'absolute', top: '1px' }}>™</sup>
            </h1>
            <h2 style={{ fontFamily: 'Open Sans', fontSize: '18px', fontWeight: 600, }}>
              Warehouse Gooseneck Light
            </h2>
          </div>
        </div>

        <Zoom zoomIn={zoomIn} zoomOut={zoomOut} />

        <Scroll upRef={refViewer.current} downRef={viewFooter.current} />
      </div>

      <div className="" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '12px' }}>
        <div className="menu">
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
                  {group.id === -1 ? "Other" : group.name}
                </div>
              );
            })}
          </div>
          <br />
          <div className="" style={{ background: "white", padding: "20px 18px" }}>
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
                          borderBottom: selectedStepId !== step.id || !closeAttribute ? "1px solid var(--template-primary--400)" : "",
                        }}
                      >
                        <div
                          className="menu_choice_step_description"
                          onClick={() => setCloseAttribute(true)}
                          style={{
                            paddingBottom: ".5em",
                            marginRight: "auto",
                            textTransform: "uppercase",
                          }}
                        >
                          {step.name}
                        </div>
                        <div
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
                        </div>
                      </div>

                      <div
                        className="menu_options"
                        style={{
                          opacity: closeAttribute && step.id === selectedStepId ? 1 : 0,
                          transform: closeAttribute && step.id === selectedStepId ? "translateY(0)" : "translateY(-10px)",
                          overflow: "hidden",
                          transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                          transitionDelay: closeAttribute && step.id === selectedStepId ? "0.2s" : "0s",
                        }}
                      >
                        {closeAttribute && step.id === selectedStepId && (
                          <>
                            {Array.from(new Map(step.options.map((attribute) => [attribute.id, attribute])).values())
                              .filter((attribute) => attribute.enabled !== false)
                              .map((attribute) => (
                                <ListItem
                                  key={attribute.id}
                                  onClick={() => handleOptionClick(attribute)}
                                  selected={attribute.selected}
                                  style={{
                                    backgroundColor: attribute.selected ? "#7f8c9d" : "white",
                                    color: attribute.selected ? "white" : "inherit",
                                    borderRadius: "11px",
                                    border: attribute.selected ? "2px solid rgb(121 136 156)" : "2.5px solid lightGray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    fontWeight: isShadeSize ? "600" : "600",
                                    fontSize: isShadeSize ? "26px !important" : "auto",
                                    height: isShadeSize ? "85px" : "auto",
                                    width: isShadeSize ? "85px" : "auto",
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
                                        fontSize: isShadeSize ? "26px" : "15px",
                                        textAlign: isShadeSize ? "center" : "inherit",
                                      }}
                                    >
                                      {isShadeSize ? attribute.name.replace(/[a-zA-Z]/g, "") : attribute.name}
                                    </div>
                                  ) : (
                                    <div className="menu_choice_option_image_container">
                                      {attribute.imageUrl && <ListItemImage src={attribute.imageUrl} />}
                                    </div>
                                  )}

                                  {!isSpecialStep && attribute.selected && (
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
                                  )}
                                </ListItem>
                              ))}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

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