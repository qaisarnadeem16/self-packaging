import { FontFamily, useZakeke } from '@zakeke/zakeke-configurator-react';
import { debounce } from 'lodash';
import { FC, JSX, useEffect, useState } from 'react';
import { CSSObjectWithLabel, GroupBase, OptionProps, SingleValueProps, components } from 'react-select';
import styled from 'styled-components';
import { Button, Columns, Icon, TextArea } from '../Atomic';

import type { PropChangeHandler } from '../layout/tdesigner';

import { ReactComponent as CurveIcon } from '../../assets/icons/text-height-solid.svg';
import { ReactComponent as BoldIcon } from '../../assets/icons/star.svg';
import { ReactComponent as ItalicSolid } from '../../assets/icons/italic-solid.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';
import AdvancedSelect from './AdvancedSelect';
import { FormControl } from './FormControl';
import ColorPicker from './colorPicker';
import { T, wrapperJoin } from 'helper';

export interface EditTextItem {
  guid: string;
  name: string;
  text: string;
  fillColor: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  isTextOnPath: boolean;
  constraints: { [key: string]: any } | null;
}

const defaultColorsPalette = ['#000000', '#FF5733',];

enum ItemType {
  Text = 0,
  Image = 1
}

export interface TextItem {
  type: ItemType;
  areaId: number;
  guid: string;
  name: string;
  text: string;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string | undefined;
  fontStretch: string;
  justification: string;
  isTextOnPath: boolean;
  constraints: {
    [key: string]: any;
  } | null;
}

const ItemTextContainer = styled.div``;

const TextToolsContainer = styled.div`
  align-items:center;
    display: flex;
    flex-direction: row;
    grid-gap: 10px;
    flex-wrap: wrap;
`;

const TextButtonsContainer = styled.div`
    // width: 50%;
    // display: grid;
    // grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
`;

const ColorPickerContainer = styled.div`
    margin-right: 5px;
    width: calc(50% - 30px);
`;

const ColorsContainer = styled.div`
  height: 40px;
  // overflow:auto;
    display: flex;
    flex-direction: row;
    // padding-bottom: 20px;
    // border-bottom: 1px #ccc dotted;
`;

const SinglePaletteItem = styled.div<{ color: string; selected: boolean }>`
    width: 20px;
    height: 20px;
    background-color: ${(props) => props.color};
    border: 1px lightgray solid;
    cursor: pointer;

    ${(props) => props.selected && `border: 1px black solid;`}

    &:hover {
        opacity: 0.6;
    }
`;

const TextColorsContainer = styled.div<{ $isDefaultPalette?: boolean }>`
    display: grid;
    ${(props) =>
    !props.$isDefaultPalette &&
    `
    grid-template-columns: repeat(auto-fill,minmax(20px,1fr));
    grid-gap: 5px;`};
    /* grid-template-columns: repeat(auto-fill,minmax(20px,1fr)); */
    width: 100%;
`;

const FontCustomOption = styled.img`
    max-width: 100%;
    height: 24px;
    object-fit: contain;
`;

const FontCustomSingleValue = styled.img`
    max-width: 100%;
    height: 24px;
    object-fit: contain;
`;

const FontCustomSingleValueContainer = styled.div`
    display: flex;
    place-content: center;
    width: 100%;
    height: 100%;
`;

const FontOption = (props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>) => {
  return (
    <components.Option {...props}>
      {<FontCustomOption src={props.data.imageUrl} alt={props.data.name} />}
    </components.Option>
  );
};

const FontSingleValue = (props: JSX.IntrinsicAttributes & SingleValueProps<any, boolean, GroupBase<any>>) => {
  return (
    <components.SingleValue {...props}>
      <FontCustomSingleValueContainer>
        {<FontCustomSingleValue src={props.data.imageUrl} alt={props.data.name} />}
      </FontCustomSingleValueContainer>
    </components.SingleValue>
  );
};

const ItemText2: FC<{
  item: EditTextItem;
  handleItemPropChange: PropChangeHandler;
  fonts?: FontFamily[];
  inDialog?: boolean;
  hideRemoveButton?: boolean;
  setMoveElements?: (value: boolean) => void
}> = ({ item, handleItemPropChange, inDialog, hideRemoveButton, setMoveElements }) => {
  const { removeItem, fonts, disableTextColors, textColors, getPrintingMethodsRestrictions, getSanitationText } =
    useZakeke();

  const constraints = item.constraints;
  const canEdit = constraints?.canEdit ?? true;
  const hasCurvedText = item.isTextOnPath;
  const isUpperCase = constraints?.toUppercase ?? false;

  let currentFont = fonts?.find((x) => x.name === item.fontFamily);

  const textRestrictions = getPrintingMethodsRestrictions();
  // Used for performance cache
  const [fillColor, setFillColor] = useState(item.fillColor || '#FF5733');

  const [fontLoading, setFontLoading] = useState(false);
  const [dirtyCharInserted, setDirtyCharInserted] = useState([] as string[]);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);


  const weightData = typeof item.fontWeight === 'number' ? ['normal', 'normal'] : item.fontWeight.split(' ');
  const isBold = weightData.length > 1 ? weightData[1] === 'bold' : weightData[0] === 'bold';
  const isItalic = weightData.length > 1 ? weightData[0] === 'italic' : false;

  const setItemTextDebounced = (value: string) => {
    handleItemPropChange?.(item, 'text', isUpperCase ? value.toUpperCase() : value);
    debounce(() => {
      const initialText = value;
      const sanitizationInfo = currentFont
        ? getSanitationText(currentFont, value)
        : {
          sanitizedText: value,
          dirtyChars: []
        };
      setDirtyCharInserted(sanitizationInfo.dirtyChars);
      const text = sanitizationInfo.sanitizedText;

      if (text !== initialText) {
        handleItemPropChange?.(item, 'text', isUpperCase ? text.toUpperCase() : text);
      }
    }, 500)();
  };

  const handleFontChange = (font: string) => {
    handleItemPropChange(item, 'font-family', font);
    currentFont = fonts?.find((x) => x.name === font);
    setItemTextDebounced(item.text);
  };

  useEffect(() => {
    handleFontChange(item.fontFamily);
    //eslint-disable-next-line
  }, []);

  if (item)
    return (
      <ItemTextContainer>
        <FormControl
          // label={item.name || T._('Text', 'Composer')}
          label={''}
          rightComponent={
            !hideRemoveButton &&
            item.constraints!.canDelete && (
              <Icon onClick={() => removeItem(item.guid)}>
                <CloseIcon />
              </Icon>
            )
          }
        >
                <div style={{ width: "100%", gap: '15px',  borderTop: '2px solid #AAAAAA8C', padding: ' 0 0', alignItems: 'baseline',   justifyContent: 'space-between' }} >

            {/* <div style={{ marginTop: '10px', padding: ' 0px', display: 'flex', alignItems: 'center', width:'100%', gap:'20px', justifyContent: 'space-between' }}> */}

              {/* <div>
                <span className="" style={{ fontWeight: "700", font: "18px", color: "#434342", width: "100%", marginTop: '50px' }}>Text</span>
              </div>
              <div style={{ cursor: 'pointer' }} onClick={() => removeItem(item.guid)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L13 5M5 5L13 13" stroke="#434342" stroke-linejoin="round" />
                  <circle cx="9" cy="9" r="8.5" stroke="#434342" />
                </svg>
              </div> */}
            {/* </div> */}

            <div className="controller" style={{ marginTop: '10px', padding:'0px 14px' }}>
              <TextToolsContainer >
                            <div style={{ marginTop: '20px', display: 'flex', flexWrap:"wrap", alignItems: 'center', position: 'relative', width: '100%', gap: '20px', justifyContent: 'space-' }}>
                                <TextArea
                                    value={isUpperCase ? item.text.toUpperCase() : item.text}
                                    onChange={(e) => {
                                        e.currentTarget.value = e.currentTarget.value.replace('⠀', '');
                                        setItemTextDebounced(e.currentTarget.value);
                                    }}
                                    maxLength={!item.constraints ? null : item.constraints.maxNrChars || null}
                                    disabled={!canEdit || fontLoading}
                                />
                               
                <div>
                  {/* <span style={{ color: '#434342', fontSize: '12px', }}>Font</span> */}

                  <FormControl label={T._('Font', 'Composer')}>
                    <div style={{ cursor: 'pointer', display: 'inline-block', }}>
                      <AdvancedSelect
                        components={{
                          Option: FontOption,
                          SingleValue: FontSingleValue,
                          DropdownIndicator: (props) => (
                            <components.DropdownIndicator {...props}>
                              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L6 6L11 1" stroke="#FF5733" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </components.DropdownIndicator>
                          )
                        }}
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: 190,
                          }),
                          control: (base, state) => ({
                            ...base,
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            padding: '4px 8px',
                            boxShadow: 'none',
                            cursor: 'pointer',
                            minHeight: '35px',
                            '&:hover': {
                              borderColor: '#aaa'
                            }
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: 0,
                            
                          }),
                          singleValue: (base) => ({
                            ...base,
                            fontFamily: 'inherit', // dynamically styled by `FontSingleValue` component
                            fontSize: '16px',
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,     
                            padding: '0 4px',
                            color: '#F2582D', // matches the red arrow color
                          }),
                          indicatorSeparator: () => ({
                            display: 'none',
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999, // important to keep menu on top
                          }),
                        }}
                        isSearchable={false}
                        options={fonts}
                        isDisabled={fontLoading}
                        menuPosition='fixed'
                        value={[fonts.find((x) => x.name === item.fontFamily)]}
                        onChange={(font: any) => {
                          item.fontFamily = font.name;
                          setFontLoading(true);
                          handleFontChange(font.name);
                          setTimeout(() => {
                            setFontLoading(false);
                          }, 2000);
                        }}
                      />
                    </div>
                  </FormControl>
                </div>


                <div>
                  {/* <span style={{ color: '#434342', fontSize: '12px' }}>Colour</span> */}
                  <FormControl label={T._('Color', 'Composer')}>
                    <ColorsContainer>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        {/* The icon trigger (like the red A from your image) */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          {/* Clickable "A" icon */}
                          <div
                            style={{
                              cursor: 'pointer',
                              color: fillColor, // Reflects the selected color
                              fontWeight: 'bold',
                              fontSize: '30px',
                              textAlign: 'center',
                            }}
                            onClick={() => setIsColorPickerVisible((prev) => !prev)} // Toggle visibility
                          >
                            A
                            <div
                              style={{
                                height: '6px',
                                backgroundColor: fillColor, // Reflects the selected color
                                marginTop: '5px',
                                width: '100%',
                              }}
                            />
                          </div>

                          {/* Color Picker shown when isColorPickerVisible is true */}
                          {isColorPickerVisible && (
                            <div
                              style={{
                                position: 'absolute',
                                  bottom: '110%',
                                  right: '-20px',
                                  // left: 0,
                                  marginTop: '8px',
                                  zIndex: 9999,
                                  background: '#fff',
                                  padding: '3px',
                                // top: '100%',
                                // right: 0,
                                // left: 0,
                                // marginTop: '8px',
                                // zIndex: 40,
                                // background: '#fff',
                                // padding: '8px',
                                // border: '1px solid #ccc',
                                // boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                              }}
                            >
                              <ColorPicker
                                color={fillColor}
                                onChange={(color) => {
                                  handleItemPropChange(item, 'font-color', color); // Update the item's font color
                                  setFillColor(color); // Update the local state to reflect the color change in the UI
                                  setIsColorPickerVisible(false); // Close the color picker after selecting a color
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </ColorsContainer>
                  </FormControl>
                </div>
                                <div
                    onClick={() => removeItem(item.guid)} style={{
                                    right: '10px',
                                    padding: '2px  0 0 0',
                                    // top: '25px',
                                    zIndex: 1,
                                    cursor:"pointer"
                                }}>
                                    <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.54594 2.4196L9.63125 1.24826C10.1094 1.11115 10.6104 1.4027 10.7495 1.89909L11.0656 3.02666L5.24779 4.69474L4.93173 3.56717C4.7926 3.07079 5.06775 2.5567 5.54594 2.4196Z" fill="white" stroke="#434342" />
                                        <path d="M14.4476 2.06228L1.86626 5.6696C1.38784 5.80677 1.11285 6.32056 1.25205 6.81717L1.85927 8.98351C1.99847 9.48012 2.49915 9.77151 2.97757 9.63434L15.5589 6.02702C16.0373 5.88985 16.3123 5.37606 16.1731 4.87945L15.5659 2.71311C15.4267 2.2165 14.926 1.92511 14.4476 2.06228Z" fill="white" stroke="#434342" />
                                        <path d="M2.875 11.3594H16.4546V22.9275C16.4546 23.4431 16.0362 23.8616 15.5205 23.8616H3.80908C3.29344 23.8616 2.875 23.4431 2.875 22.9275V11.3594Z" fill="white" stroke="#434342" />
                                        <path d="M6.27344 13.7734V21.4438" stroke="#434342" />
                                        <path d="M9.67969 13.7734V21.4438" stroke="#434342" />
                                        <path d="M13.1406 13.7734V21.4438" stroke="#434342" />
                                    </svg>
                                </div>
                                {dirtyCharInserted.length > 0 && currentFont && (
                                    <div style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                        {T._(
                                            `The following characters have been removed as they are not supported by the font ${currentFont.name
                                            }: ${wrapperJoin(dirtyCharInserted, ',', '"', '"')}`,
                                            'Composer'
                                        )}{' '}
                                    </div>
                                )}
                            </div>
                {(textRestrictions.allowedBold ||
                  textRestrictions.allowedItalic ||
                  textRestrictions.allowedCurved) && (
                    <TextButtonsContainer>
                      {(!constraints || constraints.canChangeFontWeight) &&
                        (textRestrictions.allowedBold || textRestrictions.allowedItalic) && (
                          <FormControl label={T._('Style', 'Composer')}>
                            <Columns
                              columns={
                                textRestrictions.allowedBold && textRestrictions.allowedItalic ? 2 : 1
                              }
                            >
                              {/* {textRestrictions.allowedBold && (
                                <Button
                                  outline
                                  selected={isBold}
                                  style={{ display: 'flex', gap: '3px', border: 'none', padding: "0 0 0 10px" }}
                                  onClick={() => handleItemPropChange(item, 'font-bold', !isBold)}
                                >
                                  <Icon>
                                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <mask id="path-1-outside-1_5802_2200" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="16" fill="black">
                                        <rect fill="white" width="18" height="16" />
                                        <path d="M10.5679 1.12109L15.8281 15H12.6553L11.542 11.8921H6.40234L5.27979 15H2.1626L7.44141 1.12109H10.5679ZM10.8091 9.6748L9.91846 7.1792C9.51025 6.02881 9.20101 5.02686 8.99072 4.17334C8.76807 4.98975 8.44336 5.9917 8.0166 7.1792L7.12598 9.6748H10.8091Z" />
                                      </mask>
                                      <path d="M10.5679 1.12109L15.8281 15H12.6553L11.542 11.8921H6.40234L5.27979 15H2.1626L7.44141 1.12109H10.5679ZM10.8091 9.6748L9.91846 7.1792C9.51025 6.02881 9.20101 5.02686 8.99072 4.17334C8.76807 4.98975 8.44336 5.9917 8.0166 7.1792L7.12598 9.6748H10.8091Z" fill="white" />
                                      <path d="M10.5679 1.12109L11.4095 0.802125L11.1892 0.221094H10.5679V1.12109ZM15.8281 15V15.9H17.1317L16.6697 14.681L15.8281 15ZM12.6553 15L11.808 15.3035L12.0217 15.9H12.6553V15ZM11.542 11.8921L12.3893 11.5886L12.1756 10.9921H11.542V11.8921ZM6.40234 11.8921V10.9921H5.77051L5.55587 11.5863L6.40234 11.8921ZM5.27979 15V15.9H5.91162L6.12626 15.3057L5.27979 15ZM2.1626 15L1.32139 14.68L0.857384 15.9H2.1626V15ZM7.44141 1.12109V0.221094H6.82082L6.6002 0.801143L7.44141 1.12109ZM10.8091 9.6748V10.5748H12.0859L11.6567 9.3723L10.8091 9.6748ZM9.91846 7.1792L9.07027 7.48017L9.07082 7.4817L9.91846 7.1792ZM8.99072 4.17334L9.86459 3.95804L9.03495 0.590659L8.12244 3.93653L8.99072 4.17334ZM8.0166 7.1792L7.16963 6.87482L7.16896 6.8767L8.0166 7.1792ZM7.12598 9.6748L6.27834 9.3723L5.84919 10.5748H7.12598V9.6748ZM9.72629 1.44006L14.9865 15.319L16.6697 14.681L11.4095 0.802125L9.72629 1.44006ZM15.8281 14.1H12.6553V15.9H15.8281V14.1ZM13.5026 14.6965L12.3893 11.5886L10.6947 12.1956L11.808 15.3035L13.5026 14.6965ZM11.542 10.9921H6.40234V12.7921H11.542V10.9921ZM5.55587 11.5863L4.43331 14.6943L6.12626 15.3057L7.24882 12.1978L5.55587 11.5863ZM5.27979 14.1H2.1626V15.9H5.27979V14.1ZM3.00381 15.32L8.28261 1.44105L6.6002 0.801143L1.32139 14.68L3.00381 15.32ZM7.44141 2.02109H10.5679V0.221094H7.44141V2.02109ZM11.6567 9.3723L10.7661 6.8767L9.07082 7.4817L9.96144 9.97731L11.6567 9.3723ZM10.7666 6.87823C10.3649 5.74604 10.0656 4.77392 9.86459 3.95804L8.11685 4.38864C8.33641 5.27979 8.65561 6.31157 9.07027 7.48017L10.7666 6.87823ZM8.12244 3.93653C7.90821 4.72203 7.59187 5.69991 7.16963 6.87482L8.86357 7.48358C9.29485 6.28349 9.62792 5.25746 9.85901 4.41015L8.12244 3.93653ZM7.16896 6.8767L6.27834 9.3723L7.97362 9.97731L8.86424 7.4817L7.16896 6.8767ZM7.12598 10.5748H10.8091V8.7748H7.12598V10.5748Z" fill="#434342" mask="url(#path-1-outside-1_5802_2200)" />
                                    </svg>
                                  </Icon>
                                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="#FF5733" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  </svg>
                                </Button>
                              )} */}


                              {/* <div className="">
                          10
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="#FF5733" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div> */}
                              {/* {textRestrictions.allowedItalic && (
                          <Button
                            outline
                            selected={isItalic}
                            onClick={() => handleItemPropChange(item, 'font-italic', !isItalic)}
                          >
                            <Icon>
                              <ItalicSolid />
                            </Icon>
                          </Button>
                        )} */}

                              {/* <div
                                className=""
                                style={{ cursor: "pointer", display: "inline-block", padding: "10px 20px" }}
                                onClick={() => setMoveElements?.(true)} // Optional chaining syntax>
                              >
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="0.5" y="0.5" width="27" height="27" rx="4.5" fill="white" stroke="#434342" />
                                  <path d="M16.3483 8.5368L14.0452 10.8398L11.7422 8.5368" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M13.9766 10.4688L13.9766 4.51806" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M19.4671 16.3483L17.1641 14.0452L19.4671 11.7422" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M17.5391 13.9727L23.4897 13.9727" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M8.5329 11.7416L10.8359 14.0446L8.5329 16.3477" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M10.4609 14.1172L4.51025 14.1172" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M11.7377 18.5609L14.0407 16.2578L16.3437 18.5609" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M14.1094 16.6289L14.1094 22.5796" stroke="#434342" stroke-linecap="round" stroke-linejoin="round" />
                                  <circle cx="14.0033" cy="13.9994" r="1.35484" fill="#FF5733" />
                                </svg>

                              </div> */}


                              {/* <div onClick={() => removeItem(item.guid)} style={{ cursor: 'pointer' }}>
                                <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.54594 2.4196L9.63125 1.24826C10.1094 1.11115 10.6104 1.4027 10.7495 1.89909L11.0656 3.02666L5.24779 4.69474L4.93173 3.56717C4.7926 3.07079 5.06775 2.5567 5.54594 2.4196Z" fill="white" stroke="#434342" />
                                  <path d="M14.4476 2.06228L1.86626 5.6696C1.38784 5.80677 1.11285 6.32056 1.25205 6.81717L1.85927 8.98351C1.99847 9.48012 2.49915 9.77151 2.97757 9.63434L15.5589 6.02702C16.0373 5.88985 16.3123 5.37606 16.1731 4.87945L15.5659 2.71311C15.4267 2.2165 14.926 1.92511 14.4476 2.06228Z" fill="white" stroke="#434342" />
                                  <path d="M2.875 11.3594H16.4546V22.9275C16.4546 23.4431 16.0362 23.8616 15.5205 23.8616H3.80908C3.29344 23.8616 2.875 23.4431 2.875 22.9275V11.3594Z" fill="white" stroke="#434342" />
                                  <path d="M6.27344 13.7734V21.4438" stroke="#434342" />
                                  <path d="M9.67969 13.7734V21.4438" stroke="#434342" />
                                  <path d="M13.1406 13.7734V21.4438" stroke="#434342" />
                                </svg>
                              </div> */}
                            </Columns>
                          </FormControl>
                        )}


                      {/* {(!constraints || constraints.canChangeTextPathMode) && textRestrictions.allowedCurved && (
                  <FormControl label={T._('Curved', 'Composer')}>
                    <Button
                      outline
                      selected={hasCurvedText}
                      onClick={() => handleItemPropChange(item, 'text-path', !hasCurvedText)}
                    >
                      <Icon>
                        <CurveIcon />
                      </Icon>
                    </Button>
                  </FormControl>
                )} */}
                    </TextButtonsContainer>
                  )}
              </TextToolsContainer>

            </div>

          

          </div>
        </FormControl>
      </ItemTextContainer>
    );
  else return null;
};

export default ItemText2;
