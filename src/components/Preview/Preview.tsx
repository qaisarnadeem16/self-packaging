import React from "react";
import './Preview.css'
//import { useTranslation } from "react-i18next";
// import classnames from "classnames";
//import styles from "./Preview.module.scss";
//import { openImageModal } from "../ImageModal";

export interface previewAttributes {
  image: string | undefined | null
  optionName: string | undefined
  attributeName: string | undefined
  stepName: string | undefined
  groupName: string | undefined
}

export type PreviewProps = {
    PreviewImage: previewAttributes | undefined
};

const Preview: React.FC<PreviewProps> = React.memo(props => {

  //const [t] = useTranslation();

  const onImageClick = () => {

    let title: string = "";
    if(!!props.PreviewImage && !!props.PreviewImage.groupName)
      title += props.PreviewImage?.groupName +" → "

    if(!!props.PreviewImage && !!props.PreviewImage.stepName)
      title += props.PreviewImage?.stepName +" → "

    if(!!props.PreviewImage && !!props.PreviewImage.attributeName)
      title += props.PreviewImage?.attributeName +" → "
    
    if(!!props.PreviewImage && !!props.PreviewImage.optionName)
      title += props.PreviewImage?.optionName

//     if (props.PreviewImage?.image)
//       openImageModal({
//         title: title || "",
//         description: null,
//         btnClose: t("CLOSE"),
//         url: props.PreviewImage.image,
//         imageCssClass: styles.option_preview_modal_image,
//       });
   }

  return !!props.PreviewImage?.image ? (
    <div className='ff_preview'
         data-testid="preview">
    <div
        className="preview_preview"
        data-testid="preview"
        onClick={onImageClick}
    >
        <img
        src={props.PreviewImage.image}
        alt={"CAMERA_ALT"}
        />
    </div>
    </div>
  ) : null;
});

export default Preview;
