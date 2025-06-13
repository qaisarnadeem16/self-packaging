import { FC, useRef } from "react";
import styled from "styled-components";
import { TemplateArea, useZakeke } from '@zakeke/zakeke-configurator-react';
import { Button, Icon } from '../Atomic';
import { T } from '../../Helpers';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg'
import { FormControl } from "./FormControl";
import { AddMoreButton } from "components/layout/shared-component";

export interface EditImageItem {
    guid: string,
    name: string,
    imageID: number,
    url: string,
    constraints: { [key: string]: any } | null
}

declare enum ItemType {
    Text = 0,
    Image = 1
}
export interface Item {
    type: ItemType;
    guid: string;
    name: string;
    areaId: number;
    constraints: ({
        [key: string]: any;
    }) | null;
}

interface ImageItem {
    type: ItemType;
    imageID: number;
    areaId: number;
    guid: string;
    name: string;
    url: string;
    deleted: boolean;
    constraints: ({
        [key: string]: any;
    }) | null;
}

const ImageAndButtonsContainer = styled.div`
    /* display: grid;
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 20px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap:10px;
    padding: 0 20px;
    width: 100%;
    input{
    display:none;
  }
`;

const ImagePreview = styled.div`
    border: 2px #ff5333 solid;
    border-radius: 5px;
    /* padding: 4px; */
    height: 70px;    
    width: 70px;    
    /* background: #f2f2f2; */
    overflow:hidden;
    img{
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ButtonsContainer = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items: center;
    padding:20px 0px;
    gap:20px;
    
`;

const ItemImage: FC<{ item: ImageItem, handleItemPropChange: any, currentTemplateArea: TemplateArea, uploadImgDisabled: boolean }> = ({ item, handleItemPropChange, currentTemplateArea, uploadImgDisabled }) => {
    const { removeItem } = useZakeke();
    const inputRef = useRef<HTMLInputElement>(null);
    let inputHtml!: HTMLInputElement;

    const handleChangeClick = () => inputHtml.click();

    const handleGalleryClick = () => handleItemPropChange(item, 'image-gallery');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files?.length) {
            handleItemPropChange(item, 'image-upload', e.currentTarget.files[0]);
        }
        if (inputRef.current) inputRef.current.value = ""; // Clear input
    };

    const constraints = item.constraints;
    const canEdit = constraints ? constraints.canEdit : true;

    const showUploadButton = ((!currentTemplateArea || currentTemplateArea.uploadRestrictions.isUserImageAllowed) && canEdit);
    const showGalleryButton = (!currentTemplateArea || !currentTemplateArea.disableSellerImages) && canEdit;

    return <FormControl
        label={item.name || T._("Image", "Composer")}
        rightComponent={constraints!.canDelete && <Icon onClick={() => removeItem(item.guid)}><CloseIcon /></Icon>}>
        <ImageAndButtonsContainer>
            <ImagePreview><img src={item.url} alt="" /></ImagePreview>
            <ButtonsContainer>
                {showUploadButton && (
                    <AddMoreButton
                        disabled={uploadImgDisabled}
                        onClick={() => inputRef.current?.click()}
                    >
                        {T._("Edit", "Composer")}
                    </AddMoreButton>
                )}
                {/* {showUploadButton && <AddMoreButton disabled={uploadImgDisabled} onClick={handleGalleryClick}>{T._("Edit", "Composer")}</AddMoreButton>} */}
                {showGalleryButton && <div style={{ cursor: "pointer" }} onClick={() => removeItem(item.guid)}>
                    <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.54594 2.4196L9.63125 1.24826C10.1094 1.11115 10.6104 1.4027 10.7495 1.89909L11.0656 3.02666L5.24779 4.69474L4.93173 3.56717C4.7926 3.07079 5.06775 2.5567 5.54594 2.4196Z" fill="white" stroke="#434342" />
                        <path d="M14.4476 2.06228L1.86626 5.6696C1.38784 5.80677 1.11285 6.32056 1.25205 6.81717L1.85927 8.98351C1.99847 9.48012 2.49915 9.77151 2.97757 9.63434L15.5589 6.02702C16.0373 5.88985 16.3123 5.37606 16.1731 4.87945L15.5659 2.71311C15.4267 2.2165 14.926 1.92511 14.4476 2.06228Z" fill="white" stroke="#434342" />
                        <path d="M2.875 11.3594H16.4546V22.9275C16.4546 23.4431 16.0362 23.8616 15.5205 23.8616H3.80908C3.29344 23.8616 2.875 23.4431 2.875 22.9275V11.3594Z" fill="white" stroke="#434342" />
                        <path d="M6.27344 13.7734V21.4438" stroke="#434342" />
                        <path d="M9.67969 13.7734V21.4438" stroke="#434342" />
                        <path d="M13.1406 13.7734V21.4438" stroke="#434342" />
                    </svg>
</div>}
            </ButtonsContainer>
            <input
                type="file"
                ref={inputRef} // ✅ Correct ref type
                onChange={handleInputChange}
            />
        </ImageAndButtonsContainer>
    </FormControl>
}

export default ItemImage;