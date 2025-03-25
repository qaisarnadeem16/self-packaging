import {
	ZakekeImage,
	ImageItem,
	Item,
	ProductArea,
	TemplateArea,
	TextItem,
	ZakekeDesigner,
	useZakeke
} from '@zakeke/zakeke-configurator-react';
import useStore from 'Store';
import AdvancedSelect from 'components/widgets/AdvancedSelect';
import { FormControl } from 'components/widgets/FormControl';
import { FC, JSX, useEffect, useRef, useState } from 'react';
import { CSSObjectWithLabel, GroupBase, OptionProps, SingleValueProps, components } from 'react-select';
import styled from 'styled-components';
import { T } from '../../Helpers';
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left-solid.svg';
import { ReactComponent as ArrowRightIcon } from '../../assets/icons/arrow-right-solid.svg';
import { ReactComponent as Arrows } from '../../assets/icons/arrows-alt-solid.svg';
import { ReactComponent as Add } from '../../assets/icons/plus-circle-solid.svg';
import { ReactComponent as SearchMinusSolid } from '../../assets/icons/search-minus-solid.svg';
import { ReactComponent as SearchPlusSolid } from '../../assets/icons/search-plus-solid.svg';
import {
	ArrowLeft,
	ArrowLeftIconStyled,
	ArrowRight,
	ArrowRightIconStyled,
	Button,
	CarouselContainer,
	CloseEditorButton,
	Icon,
	TextButton,
	TextIcon
} from '../Atomic';
import AddTextDialog from '../dialogs/AddTextDialog';
import { useDialogManager } from '../dialogs/Dialogs';
import ErrorDialog from '../dialogs/ErrorDialog';
import ImagesGalleryDialog from '../dialogs/ImagesGalleryDialog';
import ItemImage, { EditImageItem } from '../widgets/ItemImage';
import ItemText, { EditTextItem } from '../widgets/ItemText';
import {
	Center,
	IconsAndDesignerContainer,
	SelectContainer,
	SupportedFormatsList,
	Template,
	TemplatesContainer,
	ZakekeDesignerContainer,
	ZoomInIcon,
	ZoomOutIcon
} from './shared-component';

// Import face icons
import {
	FrontFace,
	FrontFaceActive,
	BackFace,
	BackFaceActive,
	RightFace,
	RightFaceActive,
	LeftFace,
	LeftFaceActive,
	BottomFace,
	BottomFaceActive,
	TopFace,
	TopFaceActive
} from '../../assets/icons/faceIcons';

export type PropChangeHandler = (
	item: EditTextItem | EditImageItem,
	prop: string,
	value: string | boolean | File
) => void;

export interface TranslatedTemplate {
	id: number;
	name: string;
}

const ZoomIconIn = styled(ZoomInIcon)`
	left: 0px;
  `;
const ZoomIconOut = styled(ZoomOutIcon)`
	left: 0px;
  `;

const MoveElementButton = styled(Button)`
	/* position: absolute;
	bottom: 0; */
  `;

const DesignerContainer = styled.div<{ $isMobile?: boolean }>`
	display: flex;
	flex-flow: column;
	user-select: none;
	width: 100%;
	padding: 30px 30px 70px 30px;
	${(props) =>
		props.$isMobile &&
		`
		  position:fixed;
		  top:0;
		  left:0;
		  width:100%;
		  height:100%;
		  z-index:11;
		  background-color:#ffffff;
		  overflow-y:scroll;
	  `}
  `;

const UploadButtons = styled.div`
	display: flex;
	grid-gap: 20px;
	margin: 20px 0px;
  `;

const Area = styled.div<{ selected?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 60px; /* Adjusted to fit icon */
	min-width: 70px;
	border-bottom: 5px solid transparent;
	cursor: pointer;
	padding: 5px;
	text-align: center;
  
	&:hover {
	  border-bottom: 5px solid #c4c4c4;
	}
  
	${(props) =>
		props.selected &&
		`
		 border-bottom: 5px solid #c4c4c4;
	  `}
  
	svg {
	  margin-bottom: 5px; /* Space between icon and text */
	}
  `;

const SelectOptionLabel = styled.span`
	color: black;
  `;

const SelectSingleValueLabel = styled.span`
	color: black;
  `;

const SelectOption = (props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.Option {...props}>
			<SelectOptionLabel>{props.data.name}</SelectOptionLabel>
		</components.Option>
	);
};

const SelectSingleValue = (props: JSX.IntrinsicAttributes & SingleValueProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.SingleValue {...props}>
			<SelectSingleValueLabel>{props.data.name}</SelectSingleValueLabel>
		</components.SingleValue>
	);
};

const CopyrightMessage = styled.div`
	display: flex;
	flex-direction: column;
  `;

const CopyrightMandatoryMessageContainer = styled.div`
	display: grid;
	grid-template-columns: 20px auto;
	grid-gap: 5px;
  `;

const CopyrightCheckbox = styled.input`
	width: 13px;
  `;

const CopyrightMandatoryMessage = styled.div``;

const Designer: FC<{ onCloseClick?: () => void }> = ({ onCloseClick }) => {
	const { showDialog, closeDialog } = useDialogManager();
	const [forceUpdate, setForceUpdate] = useState(false);
	const { setIsLoading, isMobile } = useStore();

	const {
		currentTemplate,
		items,
		isAreaVisible,
		product,
		templates,
		setTemplate,
		setCamera,
		removeItem,
		setItemImageFromFile,
		setItemImage,
		setItemText,
		setItemItalic,
		setItemBold,
		setItemColor,
		setItemFontFamily,
		setItemTextOnPath,
		addItemText,
		addItemImage,
		createImage,
		getTemplateUploadRestrictictions,
		eventMessages,
		setCopyrightMessageAccepted,
		getCopyrightMessageAccepted
	} = useZakeke();
	const customizerRef = useRef<any | null>(null);
	const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);

	const filteredAreas = product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];
	let finalVisibleAreas: ProductArea[] = [];

	const [moveElements, setMoveElements] = useState(false);

	const translatedTemplates = templates.map((template) => {
		return { id: template.id, name: T._d(template.name), areas: template.areas };
	});

	const translatedCurrentTemplate = {
		id: currentTemplate?.id,
		name: T._d(currentTemplate?.name ?? ''),
		areas: currentTemplate?.areas
	};

	filteredAreas.length > 0 &&
		filteredAreas.forEach((filteredArea) => {
			let currentTemplateArea = currentTemplate!.areas.find((x) => x.id === filteredArea.id);
			let itemsOfTheArea = items.filter((item) => item.areaId === filteredArea.id);
			const areAllItemsStatic = !itemsOfTheArea.some((item) => {
				return (
					!item.constraints ||
					item.constraints.canMove ||
					item.constraints.canRotate ||
					item.constraints.canResize ||
					item.constraints.canEdit
				);
			});
			if (
				!areAllItemsStatic ||
				!currentTemplateArea ||
				currentTemplateArea?.canAddImage ||
				currentTemplateArea?.canAddText
			)
				finalVisibleAreas.push(filteredArea);
		});

	const [actualAreaId, setActualAreaId] = useState<number>(
		finalVisibleAreas && finalVisibleAreas.length > 0 ? finalVisibleAreas[0].id : 0
	);

	let currentTemplateArea = currentTemplate!.areas.find((x) => x.id === actualAreaId);
	let itemsFiltered = items.filter((item) => item.areaId === actualAreaId);
	const allStaticElements = !itemsFiltered.some((item) => {
		return (
			!item.constraints || item.constraints.canMove || item.constraints.canRotate || item.constraints.canResize
		);
	});
	const showAddTextButton = !currentTemplateArea || currentTemplateArea.canAddText;
	const showUploadButton =
		!currentTemplateArea ||
		(currentTemplateArea.canAddImage && currentTemplateArea.uploadRestrictions.isUserImageAllowed);
	const showGalleryButton =
		!currentTemplateArea || (currentTemplateArea.canAddImage && !currentTemplateArea.disableSellerImages);

	const supportedFileFormats = getSupportedUploadFileFormats(currentTemplate!.id, actualAreaId).join(', ');

	const [copyrightMandatoryCheckbox, setCopyrightMandatoryCheckbox] = useState(getCopyrightMessageAccepted());
	const copyrightMessage = eventMessages && eventMessages.find((message) => message.eventID === 8);

	const slidesToShow = window.innerWidth <= 1600 ? 3 : 4;

	const setTemplateByID = async (templateID: number) => await setTemplate(templateID);

	useEffect(() => {
		if (templates.length > 0 && !currentTemplate) setTemplateByID(templates[0].id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [templates]);

	useEffect(() => {
		const area = filteredAreas.filter((a) => a.id === actualAreaId);
		if (area && area.length > 0) setCamera(area[0].cameraLocationID as string);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actualAreaId]);

	useEffect(() => {
		if (finalVisibleAreas.length > 0 && actualAreaId === 0) setActualAreaId(finalVisibleAreas[0].id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finalVisibleAreas]);

	function getSupportedUploadFileFormats(templateId: number, areaId: number) {
		const restrictions = getTemplateUploadRestrictictions(templateId, areaId);
		const fileFormats: string[] = [];

		if (restrictions.isJpgAllowed) fileFormats.push('.jpg', '.jpeg');
		if (restrictions.isPngAllowed) fileFormats.push('.png');
		if (restrictions.isSvgAllowed) fileFormats.push('.svg');
		if (restrictions.isEpsAllowed) fileFormats.push('.eps');
		if (restrictions.isPdfAllowed) fileFormats.push('.pdf');

		return fileFormats;
	}

	const isItemEditable = (item: Item, templateArea?: TemplateArea) => {
		if (!item.constraints) return false;

		let {
			canEdit,
			canMove,
			canRotate,
			canResize,
			canDelete,
			canChangeFontColor,
			canChangeFontFamily,
			canChangeFontWeight,
			isPrintable
		} = item.constraints;

		if (!isPrintable) return false;

		let common = canEdit || canMove || canRotate || canResize || canDelete;
		let text = canChangeFontColor || canChangeFontFamily || canChangeFontWeight;
		let image =
			canEdit ||
			(templateArea && (templateArea.uploadRestrictions.isUserImageAllowed || !templateArea.disableSellerImages));

		if (item.type === 0) return common || text;
		else return common || image;
	};

	const handleAddTextClick = () => {
		showDialog(
			'add-text',
			<AddTextDialog
				onClose={() => closeDialog('add-text')}
				onConfirm={(item) => {
					addItemText(item, actualAreaId);
					closeDialog('add-text');
				}}
			/>
		);
	};

	const handleAddImageFromGalleryClick = async () => {
		showDialog(
			'add-image',
			<ImagesGalleryDialog
				onClose={() => closeDialog('add-image')}
				onImageSelected={(image: { imageID: number }) => {
					addItemImage(image.imageID, actualAreaId);
					closeDialog('add-image');
				}}
			/>
		);
	};

	const handleUploadImageClick = async (
		addItemImage: (guid: any, imageId: number) => Promise<void>,
		createImage: (file: File, progress?: (percentage: number) => void) => Promise<ZakekeImage>
	) => {
		if (currentTemplate && actualAreaId) {
			const fileFormats = getSupportedUploadFileFormats(currentTemplate.id, actualAreaId);
			let input = document.createElement('input');
			input.setAttribute('accept', fileFormats.join(','));
			input.setAttribute('type', 'file');
			input.addEventListener('change', async (e) => {
				const files = (e.currentTarget as HTMLInputElement).files;
				if (files && files.length > 0 && actualAreaId) {
					setIsLoading(true);
					try {
						const image = await createImage(files[0], (progress: number) => console.log(progress));
						addItemImage(image.imageID, actualAreaId);
						input.remove();
					} catch (ex) {
						console.error(ex);
						showDialog(
							'error',
							<ErrorDialog
								error={T._('Failed uploading image.', 'Composer')}
								onCloseClick={() => closeDialog('error')}
							/>
						);
					} finally {
						setIsLoading(false);
					}
				}
			});
			document.body.appendChild(input);
			input.click();
		}
	};

	const handleItemRemoved = (guid: string) => {
		removeItem(guid);
	};

	const handleItemImageChange = async (item: EditImageItem, file: File) => {
		try {
			setIsLoading(true);
			await setItemImageFromFile(item.guid, file);
		} catch (ex) {
			console.error(ex);
		} finally {
			setIsLoading(false);
		}
	};

	const handleItemImageGallery = async (item: EditImageItem) => {
		showDialog(
			'add-image',
			<ImagesGalleryDialog
				onClose={() => closeDialog('add-image')}
				onImageSelected={async (image: { imageID: number }) => {
					closeDialog('add-image');
					try {
						setIsLoading(true);
						await setItemImage(item.guid, image.imageID);
					} catch (ex) {
						console.error(ex);
					} finally {
						setIsLoading(false);
					}
				}}
			/>
		);
	};

	const handleItemPropChange = (item: EditTextItem | EditImageItem, prop: string, value: string | boolean | File) => {
		switch (prop) {
			case 'remove':
				handleItemRemoved(item.guid);
				break;
			case 'image-upload':
				handleItemImageChange(item as EditImageItem, value as File);
				break;
			case 'image-gallery':
				handleItemImageGallery(item as EditImageItem);
				break;
			case 'text':
				setItemText(item.guid, value as string);
				break;
			case 'font-italic':
				setItemItalic(item.guid, value as boolean);
				break;
			case 'font-bold':
				setItemBold(item.guid, value as boolean);
				break;
			case 'font-color':
				setItemColor(item.guid, value as string);
				break;
			case 'font-family':
				console.log(item);
				setItemFontFamily(item.guid, value as string);
				console.log(item);
				break;
			case 'text-path':
				setItemTextOnPath(item.guid, actualAreaId, value as boolean);
				setTimeout(() => setForceUpdate(!forceUpdate), 100);
				break;
		}
	};

	return (
		<>
			{!moveElements && (
				<DesignerContainer $isMobile={isMobile}>
					{/* Templates */}
					{!isMobile && templates.length > 1 && (
						<TemplatesContainer>
							{templates.map((template) => (
								<Template
									key={template.id}
									selected={currentTemplate === template}
									onClick={async () => {
										await setTemplate(template.id);
									}}
								>
									{T._d(template.name)}
								</Template>
							))}
						</TemplatesContainer>
					)}

					{/* Areas */}
					{!isMobile && finalVisibleAreas.length > 1 && (
						<CarouselContainer
							slidesToScroll={1}
							speed={50}
							slidesToShow={slidesToShow}
							slideIndex={selectedCarouselSlide}
							afterSlide={setSelectedCarouselSlide}
							renderBottomCenterControls={() => <span />}
							renderCenterRightControls={() => {
								if (
									selectedCarouselSlide !==
									(finalVisibleAreas.length - slidesToShow > 0
										? finalVisibleAreas.length - slidesToShow
										: selectedCarouselSlide)
								)
									return (
										<ArrowRight onClick={() => setSelectedCarouselSlide(selectedCarouselSlide + 1)}>
											<ArrowRightIconStyled>
												<ArrowRightIcon />
											</ArrowRightIconStyled>
										</ArrowRight>
									);
							}}
							renderCenterLeftControls={() => {
								if (selectedCarouselSlide !== 0)
									return (
										<ArrowLeft onClick={() => setSelectedCarouselSlide(selectedCarouselSlide - 1)}>
											<ArrowLeftIconStyled>
												<ArrowLeftIcon />
											</ArrowLeftIconStyled>
										</ArrowLeft>
									);
							}}
						>
							{finalVisibleAreas.map((area) => {
								// Determine which icon to use based on area name
								const isSelected = actualAreaId === area.id;
								let IconComponent;
								switch (T._d(area.name).toLowerCase()) {
									case 'front':
										IconComponent = isSelected ? FrontFaceActive : FrontFace;
										break;
									case 'back':
										IconComponent = isSelected ? BackFaceActive : BackFace;
										break;
									case 'right':
										IconComponent = isSelected ? RightFaceActive : RightFace;
										break;
									case 'left':
										IconComponent = isSelected ? LeftFaceActive : LeftFace;
										break;
									case 'bottom':
										IconComponent = isSelected ? BottomFaceActive : BottomFace;
										break;
									case 'top':
										IconComponent = isSelected ? TopFaceActive : TopFace;
										break;
									default:
										IconComponent = FrontFace; // Default icon if no match
								}

								return (
									<Area
										key={area.id}
										selected={isSelected}
										onClick={() => setActualAreaId(area.id)}
									>
										<IconComponent />
										{T._d(area.name)}
									</Area>
								);
							})}
						</CarouselContainer>
					)}

					{isMobile && translatedTemplates.length > 1 && (
						<SelectContainer>
							<FormControl label={T._('Templates', 'Composer')}>
								<AdvancedSelect
									styles={{
										container: (base) =>
										({
											...base,
											minWidth: 300
										} as CSSObjectWithLabel),
									}}
									isSearchable={false}
									options={translatedTemplates}
									menuPosition="fixed"
									components={{
										Option: SelectOption,
										SingleValue: SelectSingleValue
									}}
									value={translatedTemplates!.find((x) => x.id === translatedCurrentTemplate.id)}
									onChange={async (template: any) => await setTemplate(template.id)}
								/>
							</FormControl>
						</SelectContainer>
					)}
					{isMobile && finalVisibleAreas.length > 1 && (
						<SelectContainer>
							<FormControl label={T._('Customizable Areas', 'Composer')}>
								<AdvancedSelect
									styles={{
										container: (base) =>
										({
											...base,
											minWidth: 300
										} as CSSObjectWithLabel)
									}}
									isSearchable={false}
									options={finalVisibleAreas}
									menuPosition="fixed"
									components={{
										Option: SelectOption,
										SingleValue: SelectSingleValue
									}}
									value={finalVisibleAreas.find((x) => x.id === actualAreaId) ?? finalVisibleAreas[0]}
									onChange={(area: any) => setActualAreaId(area.id)}
								/>
							</FormControl>
						</SelectContainer>
					)}

					{itemsFiltered.length === 0 && !(showAddTextButton || showUploadButton || showGalleryButton) && (
						<Center>{T._('No customizable items', 'Composer')}</Center>
					)}

					{itemsFiltered.map((item) => {
						if (item.type === 0 && isItemEditable(item, currentTemplateArea))
							return (
								<ItemText
									key={item.guid}
									handleItemPropChange={handleItemPropChange}
									item={item as TextItem}
								/>
							);
						else if (item.type === 1 && isItemEditable(item, currentTemplateArea))
							return (
								<ItemImage
									uploadImgDisabled={
										copyrightMessage && copyrightMessage.additionalData.enabled
											? !copyrightMandatoryCheckbox
											: false
									}
									key={item.guid}
									handleItemPropChange={handleItemPropChange}
									item={item as ImageItem}
									currentTemplateArea={currentTemplateArea!}
								/>
							);

						return null;
					})}

					{(showAddTextButton || showUploadButton || showGalleryButton) && (
						<UploadButtons>

							<div className="">
								<p>Custom tool</p>
							</div>
							{showAddTextButton && (
								<TextButton  onClick={handleAddTextClick}>
									<TextIcon>
										<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M39.9852 3.27734H3.76562V39.9153H39.9852V3.27734Z" fill="white" stroke="#434342" />
											<path d="M18.6442 11.9697H16.6163C15.4053 11.9697 14.5185 12.1015 13.9495 12.3652C13.3806 12.6288 12.9038 13.1529 12.516 13.9407C12.1282 14.7284 11.8962 15.6576 11.8135 16.7379H9.80469V9.79297H33.9426V16.7379H31.9338C31.5555 14.8667 31.0215 13.6031 30.3318 12.9504C29.6452 12.2977 28.5486 11.9697 27.042 11.9697H24.96V29.2067C24.96 30.3224 25.1476 31.1005 25.5195 31.5378C25.8945 31.9751 26.6796 32.1937 27.8779 32.1937H28.5009V34.1904H15.1764V32.1937H15.7454C16.9564 32.1937 17.7415 31.9686 18.1039 31.5185C18.4662 31.0684 18.6474 30.2967 18.6474 29.2067V11.9697H18.6442Z" stroke="#434342" />
											<path d="M42.1055 37.375H38.0402C37.5434 37.375 37.1406 37.7824 37.1406 38.2849V42.0821C37.1406 42.5847 37.5434 42.9921 38.0402 42.9921H42.1055C42.6023 42.9921 43.0051 42.5847 43.0051 42.0821V38.2849C43.0051 37.7824 42.6023 37.375 42.1055 37.375Z" fill="white" stroke="#FF5733" />
											<path d="M42.1055 1H38.0402C37.5434 1 37.1406 1.40738 37.1406 1.90992V5.70715C37.1406 6.20968 37.5434 6.61707 38.0402 6.61707H42.1055C42.6023 6.61707 43.0051 6.20968 43.0051 5.70715V1.90992C43.0051 1.40738 42.6023 1 42.1055 1Z" fill="white" stroke="#FF5733" />
											<path d="M5.9649 37.375H1.89953C1.40273 37.375 1 37.7824 1 38.2849V42.0821C1 42.5847 1.40273 42.9921 1.89953 42.9921H5.9649C6.4617 42.9921 6.86443 42.5847 6.86443 42.0821V38.2849C6.86443 37.7824 6.4617 37.375 5.9649 37.375Z" fill="white" stroke="#FF5733" />
											<path d="M5.9649 1H1.89953C1.40273 1 1 1.40738 1 1.90992V5.70715C1 6.20968 1.40273 6.61707 1.89953 6.61707H5.9649C6.4617 6.61707 6.86443 6.20968 6.86443 5.70715V1.90992C6.86443 1.40738 6.4617 1 5.9649 1Z" fill="white" stroke="#FF5733" />
										</svg>
									</TextIcon>
									<span>{T._('Text', 'Composer')}</span>
								</TextButton>
							)}

							{showGalleryButton && (
								<TextButton  onClick={handleAddImageFromGalleryClick}>
									<TextIcon>
										<svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M42.3792 4.38672H2.63711C1.74159 4.38672 1.01562 5.11877 1.01562 6.0218V32.8637C1.01562 33.7667 1.74159 34.4988 2.63711 34.4988H42.3792C43.2747 34.4988 44.0007 33.7667 44.0007 32.8637V6.0218C44.0007 5.11877 43.2747 4.38672 42.3792 4.38672Z" fill="white" stroke="#434342" />
											<path d="M29.1327 17.0156H19.7812V25.8168H29.1327V17.0156Z" fill="white" stroke="#434342" stroke-width="0.82" />
											<path d="M32.7846 28.5225C35.6212 28.5225 37.9207 26.2037 37.9207 23.3433C37.9207 20.4829 35.6212 18.1641 32.7846 18.1641C29.948 18.1641 27.6484 20.4829 27.6484 23.3433C27.6484 26.2037 29.948 28.5225 32.7846 28.5225Z" fill="white" stroke="#434342" />
											<path d="M29.7246 7.73047L31.3131 12.874H36.457L32.2952 16.0517L33.8864 21.1952L29.7246 18.0147L25.5628 21.1952L27.154 16.0517L22.9922 12.874H28.136L29.7246 7.73047Z" fill="white" stroke="#FF5733" />
											<path d="M1.00123 6.16478C1.16423 4.01928 1.32438 1.10093 8.37369 3.06188C14.302 4.70849 14.8167 1 14.8167 1L14.8453 26.5067C14.6795 28.6493 14.4392 31.8474 7.47287 29.6096C0.186194 27.268 1.02982 32.6779 1.02982 32.6779L1.00123 6.1619V6.16478Z" fill="white" stroke="#434342" stroke-width="0.92" />
										</svg>
									</TextIcon>
									<span>{T._('Clipart', 'Composer')}</span>
								</TextButton>
							)}

							{showUploadButton && (
								<>
									<TextButton
										disabled={
											copyrightMessage && copyrightMessage.additionalData.enabled
												? !copyrightMandatoryCheckbox
												: false
										}
										
										onClick={() => handleUploadImageClick(addItemImage, createImage)}
									>
										<TextIcon>
											<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H35C35.8284 0.5 36.5 1.17157 36.5 2V35C36.5 35.8284 35.8284 36.5 35 36.5H2C1.17157 36.5 0.5 35.8284 0.5 35V2Z" fill="white" stroke="#434342" />
												<g clip-path="url(#clip0_5803_2389)">
													<path d="M29.8288 7.09375H7.17188V29.9617H29.8288V7.09375Z" fill="white" stroke="#434342" stroke-miterlimit="10" />
													<path d="M30.0382 25.4184L25.2562 21.8536L22.5557 24.7906L11.9539 15.9766L7.17188 20.5949V30.0367H30.0382V25.4184Z" fill="#434342" />
													<path d="M25.6722 14.6488C26.8201 14.6488 27.7507 13.7096 27.7507 12.551C27.7507 11.3924 26.8201 10.4531 25.6722 10.4531C24.5243 10.4531 23.5938 11.3924 23.5938 12.551C23.5938 13.7096 24.5243 14.6488 25.6722 14.6488Z" fill="#434342" />
													<path d="M7.21094 6.29975V3.08203" stroke="#FF5733" stroke-miterlimit="10" />
													<path d="M7.21094 33.9169V30.6992" stroke="#FF5733" stroke-miterlimit="10" />
													<path d="M6.27398 7.18359H3.08594" stroke="#FF5733" stroke-miterlimit="10" />
													<path d="M6.27398 29.832H3.08594" stroke="#FF5733" stroke-miterlimit="10" />
													<path d="M29.7734 30.6992V33.9169" stroke="#FF5733" stroke-miterlimit="10" />
													<path d="M30.7344 29.832H33.9193" stroke="#FF5733" stroke-miterlimit="10" />
													<path d="M29.7734 3.08203V6.29975" stroke="#FF5733" stroke-miterlimit="10" />
													<path d="M30.4688 7.18359H33.6568" stroke="#FF5733" stroke-miterlimit="10" />
												</g>
												<defs>
													<clipPath id="clip0_5803_2389">
														<rect width="30.8333" height="30.8333" fill="white" transform="translate(3.08594 3.08203)" />
													</clipPath>
												</defs>
											</svg>
										</TextIcon>
										<span>
											<span>
												{itemsFiltered.some(
													(item) =>
														item.type === 1 && isItemEditable(item, currentTemplateArea)
												)
													? T._('Upload another image', 'Composer')
													: T._('Upload Images', 'Composer')}{' '}
											</span>
										</span>
									</TextButton>
								</>
							)}
							{/* <SupportedFormatsList>
								{T._('Supported file formats:', 'Composer') + ' ' + supportedFileFormats}
							</SupportedFormatsList> */}

							{copyrightMessage && copyrightMessage.visible && (
								<CopyrightMessage>
									<div dangerouslySetInnerHTML={{ __html: copyrightMessage.description }} />
									{copyrightMessage && copyrightMessage.additionalData.enabled && (
										<CopyrightMandatoryMessageContainer>
											<CopyrightCheckbox
												type="checkbox"
												defaultChecked={copyrightMandatoryCheckbox}
												onClick={() => {
													setCopyrightMessageAccepted(!copyrightMandatoryCheckbox);
													setCopyrightMandatoryCheckbox(!copyrightMandatoryCheckbox);
												}}
											/>
											<CopyrightMandatoryMessage
												dangerouslySetInnerHTML={{
													__html: copyrightMessage.additionalData.message
												}}
											/>
										</CopyrightMandatoryMessageContainer>
									)}
								</CopyrightMessage>
							)}
						</UploadButtons>
					)}
					{itemsFiltered.length > 0 && !allStaticElements && (
						<MoveElementButton isFullWidth outline onClick={() => setMoveElements(true)}>
							<Icon>
								<Arrows />
							</Icon>
							<span>{T._('Move elements', 'Composer')} </span>
						</MoveElementButton>
					)}
					{isMobile && <CloseEditorButton onClick={onCloseClick}>{T._('OK', 'Composer')}</CloseEditorButton>}
				</DesignerContainer>
			)}
			{moveElements && (
				<ZakekeDesignerContainer $isMobile={isMobile} className="zakeke-container">
					<ZakekeDesigner ref={customizerRef} areaId={actualAreaId} />
					<IconsAndDesignerContainer>
						<ZoomIconIn hoverable onClick={() => customizerRef.current.zoomIn()}>
							<SearchPlusSolid />
						</ZoomIconIn>
						<ZoomIconOut hoverable onClick={() => customizerRef.current.zoomOut()}>
							<SearchMinusSolid />
						</ZoomIconOut>
					</IconsAndDesignerContainer>
					<Button isFullWidth onClick={() => setMoveElements(false)}>
						<span>{T._('OK', 'Composer')} </span>
					</Button>
				</ZakekeDesignerContainer>
			)}
		</>
	);
};

export default Designer;