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

const defaultColorsPalette = ['#000000', '#FFFFFF'];

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
	display: flex;
	flex-direction: row;
	grid-gap: 10px;
	flex-wrap: wrap;
`;

const TextButtonsContainer = styled.div`
	width: 50%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 5px;
`;

const ColorPickerContainer = styled.div`
	margin-right: 5px;
	width: calc(50% - 30px);
`;

const ColorsContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding-bottom: 20px;
	border-bottom: 1px #ccc dotted;
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

const ItemText: FC<{
  item: EditTextItem;
  handleItemPropChange: PropChangeHandler;
  fonts?: FontFamily[];
  inDialog?: boolean;
  hideRemoveButton?: boolean;
}> = ({ item, handleItemPropChange, inDialog, hideRemoveButton }) => {
  const { removeItem, fonts, disableTextColors, textColors, getPrintingMethodsRestrictions, getSanitationText } =
    useZakeke();

  const constraints = item.constraints;
  const canEdit = constraints?.canEdit ?? true;
  const hasCurvedText = item.isTextOnPath;
  const isUpperCase = constraints?.toUppercase ?? false;

  let currentFont = fonts?.find((x) => x.name === item.fontFamily);

  const textRestrictions = getPrintingMethodsRestrictions();
  // Used for performance cache
  const [fillColor, setFillColor] = useState(item.fillColor);

  const [fontLoading, setFontLoading] = useState(false);
  const [dirtyCharInserted, setDirtyCharInserted] = useState([] as string[]);

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
          <div style={{ width: "100%", borderRight: '1px #AAAAAA dashed', borderTop: '1px #AAAAAA dashed', padding:'2px 10px 0 0'}} >
          <TextArea
            value={isUpperCase ? item.text.toUpperCase() : item.text}
            onChange={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace('⠀', '');
              setItemTextDebounced(e.currentTarget.value);
            }}
            maxLength={!item.constraints ? null : item.constraints.maxNrChars || null}
            disabled={!canEdit || fontLoading}
          />
          {dirtyCharInserted.length > 0 && currentFont && (
            <div style={{ color: 'red' }}>
              {T._(
                `The following characters have been removed as they are not supported by the font ${currentFont.name
                }: ${wrapperJoin(dirtyCharInserted, ',', '"', '"')}`,
                'Composer'
              )}{' '}
            </div>
          )}
          </div>
        </FormControl>

        <TextToolsContainer>
          {(!constraints || constraints.canChangeFontFamily) && (
            <FormControl label={T._('Font', 'Composer')}>
              <AdvancedSelect
                components={{
                  Option: FontOption,
                  SingleValue: FontSingleValue
                }}
                styles={{
                  container: (base) =>
                  ({
                    ...base,
                    width: 200
                  } as CSSObjectWithLabel)
                }}
                isSearchable={false}
                options={fonts}
                isDisabled={fontLoading}
                menuPosition='fixed'
                value={[fonts!.find((x) => x.name === item.fontFamily)]}
                onChange={(font: any) => {
                  item.fontFamily = font.name;
                  setFontLoading(true);
                  handleFontChange(font.name);
                  setTimeout(() => {
                    setFontLoading(false);
                  }, 2000);
                }}
              />
            </FormControl>
          )}
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
                        {textRestrictions.allowedBold && (
                          <Button
                            outline
                            selected={isBold}
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
                          </Button>
                        )}
                        {textRestrictions.allowedItalic && (
                          <Button
                            outline
                            selected={isItalic}
                            onClick={() => handleItemPropChange(item, 'font-italic', !isItalic)}
                          >
                            <Icon>
                              <ItalicSolid />
                            </Icon>
                          </Button>
                        )}
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

        {/* {(!disableTextColors || !(disableTextColors && textColors.length === 1)) &&
          !!item.constraints?.canChangeFontColor && (
            <FormControl label={T._('Color', 'Composer')}>
              <ColorsContainer>
                {!disableTextColors && (
                  <ColorPickerContainer>
                    <ColorPicker
                      color={fillColor}
                      onChange={(color) => {
                        // handleFillColorChange(color);
                        handleItemPropChange(item, 'font-color', color);
                        setFillColor(color);
                      }}
                    />
                  </ColorPickerContainer>
                )}

                {!disableTextColors && (
                  <TextColorsContainer $isDefaultPalette>
                    {defaultColorsPalette.map((hex) => (
                      <SinglePaletteItem
                        key={hex}
                        onClick={() => {
                          handleItemPropChange(item, 'font-color', hex);
                          setFillColor(hex);
                        }}
                        selected={hex === fillColor}
                        color={hex}
                      />
                    ))}
                  </TextColorsContainer>
                )}

                {disableTextColors && (
                  <TextColorsContainer>
                    {textColors.map((textColor) => (
                      <SinglePaletteItem
                        key={textColor.colorCode}
                        onClick={() => {
                          handleItemPropChange(item, 'font-color', textColor.colorCode);
                          setFillColor(textColor.colorCode);
                        }}
                        selected={textColor.colorCode === fillColor}
                        color={textColor.colorCode}
                      />
                    ))}
                  </TextColorsContainer>
                )}
              </ColorsContainer>
            </FormControl>
          )} */}
      </ItemTextContainer>
    );
  else return null;
};

export default ItemText;
