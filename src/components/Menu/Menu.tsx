import React, { useEffect, useState } from "react";
// import classNames from "classnames";
// import { useTranslation } from "react-i18next";

// import {
//   CustomizationParams,
//   instanceOfViewerGroupAttribute,
//   instanceOfViewerGroupCustomizations,
//   instanceOfViewerGroupStep,
//   SPECIAL_OPTION,
//   ViewerAttributeInterface,
//   ViewerCustomizationInterface,
//   ViewerGroupInterface,
//   ViewerOptionInterface,
//   ViewerStateInterface,
//   ViewerStepInterface,
// } from "../../core";


  interface CustomizationParams{}
  interface instanceOfViewerGroupAttribute{}
  interface instanceOfViewerGroupCustomizations{}
  interface instanceOfViewerGroupStep{}
  interface SPECIAL_OPTION{}
  interface ViewerAttributeInterface{}
  interface ViewerCustomizationInterface{}
  interface ViewerGroupInterface{
    id: number;
    selectedGroupId: number;

  }
  interface ViewerOptionInterface{}
  interface ViewerStateInterface{}
  interface ViewerStepInterface{}

  

// import MenuGroups from "../MenuGroups";
// import MenuChoice from "../MenuChoice";
// import { Share as ShareIcon } from "../../icons";

// import styles from "./Menu.module.scss";

export type MenuProps = {
  groups: ViewerGroupInterface[] ; 
  selectedGroupId: number | null;
  // selectedStepId: string | null;
  // selectedAttributeId: string | null;
  price: number | null;
  //isCartLoading: boolean;
  // params: CustomizationParams | null;
  // groupSelected: (group: ViewerGroupInterface) => void;
  // stepSelect: (step: ViewerStepInterface) => void;
  // attributeSelected: (attribute: ViewerAttributeInterface) => void;
  // optionSelected: (option: ViewerOptionInterface) => void;
  // showOptionPreview: (option: ViewerOptionInterface) => void;
  // saveText: (
  //   customization: ViewerCustomizationInterface,
  //   text: string | null
  // ) => void;
  // showCustomizationInfo: (info: ViewerCustomizationInterface) => void;
  //addToCart: () => void;
  // share: () => void;
  // setViewerState: (state: ViewerStateInterface) => void;
  // viewerState: ViewerStateInterface
};


const Menu: React.FC<MenuProps> = props => {
  // const [t] = useTranslation();
  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState<ViewerGroupInterface | null>(null);

  // const isOptionNotSetSelected = (attributes: ViewerAttributeInterface[]) => {
  //   return attributes.some(attribute=> attribute.options.some(option=> option.selected && option.id === SPECIAL_OPTION.NOT_SET))
  // }

  // const isOneStepOrAttributeSelected = (group: ViewerGroupInterface) => {
    
  //   if(instanceOfViewerGroupStep(group)){

  //     return group.steps.some(step => {
  //       return step.attributes.some(attribute => isAttrbuteSelected(attribute))
  //     })
  //   }
  //   else if(instanceOfViewerGroupAttribute(group)){
  //     return group.attributes.some(attribute => isAttrbuteSelected(attribute))
  //   }
  // }

  // const isAttrbuteSelected = (attribute: ViewerAttributeInterface) => {
  //   return attribute.options.some(option=> option.selected && option.id !== SPECIAL_OPTION.NOT_SET)
  // }

  // const isGroupRequiredOne = (group: ViewerGroupInterface) => {
  //   return props.params?.groupSettings?.requiredOne.some(requiredGroup => group.id === requiredGroup)
  // }

  // const isAddToCartDisabled = (groups: ViewerGroupInterface[]) =>{
  //   return groups.some(group => {
  //     if(instanceOfViewerGroupStep(group)){
  //       if(!!isGroupRequiredOne(group)){
  //         return !isOneStepOrAttributeSelected(group)
  //       }else{
  //         return group.steps.some(step => {
  //           return isOptionNotSetSelected(step.attributes)
  //         })
  //       }
  //     }
  //     else if(instanceOfViewerGroupAttribute(group)){
  //       if(!!isGroupRequiredOne(group)){
  //         return !isOneStepOrAttributeSelected(group)
  //       }else{
  //         return isOptionNotSetSelected(group.attributes)
  //       }
  //     }
  //     else if(instanceOfViewerGroupCustomizations(group) && group.customizations?.length && !(props.params?.initialsRequired === false)){
  //       const engraving = group.customizations[0];
  //       const {maxNrChars, minNrChars} = engraving.constraint || {maxNrChars: null, minNrChars: null}
  //       const text = engraving.text || "";
  //       return (minNrChars && minNrChars > text.length) || (maxNrChars && maxNrChars < text.length)
  //     }
  //     else{
  //       return false;
  //     }
      
  //   })

  // }

  useEffect(() => {
    // console.log(props.groups, 'pro[s.');
    setSelectedGroup(
      props.groups?.find(grp => grp.id === props.selectedGroupId) || null
    );
  }, [props.groups, props.selectedGroupId]);

  const sortItems = <T extends { displayOrder: number }>(items: T[]): T[] => {
    return (items || []).sort((a, b) => a.displayOrder - b.displayOrder);
  };

  return (
    <div className={'null'} data-testid="menu">
      <h1>Menu</h1>
      {/* <MenuGroups
        groups={sortItems(props.groups)}
        selectedGroupId={props.selectedGroupId || null}
        onSelect={props.groupSelected}
      /> */}
      {/* {selectedGroup && (
        <MenuChoice
          groups={props.groups}
          group={selectedGroup}
          params={props.params}
          setViewerState={props.setViewerState}
          viewerState={props.viewerState}
          selectedStepId={props.selectedStepId}
          selectedAttributeId={props.selectedAttributeId}
          stepSelect={props.stepSelect}
          attributeSelect={props.attributeSelected}
          optionSelect={props.optionSelected}
          saveText={props.saveText}
          showCustomizationInfo={props.showCustomizationInfo}
          showOptionPreview={props.showOptionPreview}
        />
      )} */}

      <div className={'null'}>
        {
          <div className={'null'}>
            <div className={'null'}>{"PRICE"}</div>
            <div className={'null'}>{props.price!}</div>
          </div>
        }
        <div className={'null'}>
          {/* {
            <button
              // className={classNames(
              //   "btn",
              //   "btn-primary",
              //   styles.ff_menu__btn,
              //   styles.ff_menu__btn__cart,
              //   {
              //     [styles.ff_menu__btn__is_cart_loading]: props.isCartLoading,
              //   }
              // )}
              onClick={() => !props.isCartLoading && props.addToCart()}
              // disabled={isAddToCartDisabled(props.groups)}
            >
              {("ADD_TO_CART")}
            </button>
          } */}

          {/* {!props.params?.shareHidden && (
            <button
              className={classNames(
                "btn",
                "btn-secondary",
                styles.ff_menu__btn,
                styles.ff_menu__btn__share
              )}
              onClick={() => props.share()}
            >
              <div className={styles.ff_menu__btn__share_icon}>
                <ShareIcon />
              </div>
              <span className={styles.ff_menu__btn__share_text}>
                {t("SHARE")}
              </span>
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Menu;
