import {
	ZakekeImage,
	ImageItem,
	Item,
	ProductArea,
	TemplateArea,
	TextItem,
	ZakekeDesigner,
	useZakeke,
	ImageCategory,
	ImageMacroCategory
} from '@zakeke/zakeke-configurator-react';
import useStore from 'Store';
import AdvancedSelect from 'components/widgets/AdvancedSelect';
import { FormControl } from 'components/widgets/FormControl';
import { FC, JSX, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
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
	ImagesList,
	ImageItem1,
	SelectContainer,
	SupportedFormatsList,
	Template,
	TemplatesContainer,
	ZakekeDesignerContainer,
	ZoomInIcon,
	ZoomOutIcon,
	AddMoreButton
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
import ItemText2 from 'components/widgets/itemText2';
import { useActualGroups } from 'helper';

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
	padding: 20px 0;
	${(props) =>
		props.$isMobile &&
		`
		  top:0;
		  left:0;
		  width:100%;
		  height:100%;
		  z-index:11;
		  background-color:#ffffff;
	  `}
  `;

const UploadButtons = styled.div`
	// display: flex;
	grid-gap: 20px;
	margin: 20px 0px;
	align-items:center;
  @media (max-width: 768px) {
	  flex-direction: column;
	  align-items:start;
  }
  `;


const UploadButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin: 8px 0px 0px 0px;
  @media (max-width: 768px) {
	 gap:15px;
	 overflow:auto;
	 padding:10px 0px;
  }

`;




const Area = styled.div<{ selected?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 50px; /* Adjusted to fit icon */
	margin-top:15px;
	border-bottom: 5px solid transparent;
	cursor: pointer;
	padding: 5px 10px;
	text-align: center;
/*   
	&:hover {
	  border-bottom: 5px solid #c4c4c4;
	}
   */
	/* ${(props) =>
		props.selected &&
		`
		 border-bottom: 5px solid #c4c4c4;
	  `} */
  
	svg {
	  margin-bottom: 5px; /* Space between icon and text */
	}

	
  @media (max-width: 768px) {
	  padding: 6px;
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
		// getTemplateUploadRestrictictions,
		eventMessages,
		setCopyrightMessageAccepted,
		getCopyrightMessageAccepted,
		defaultColor,
		fonts ,
		getPrintingMethods ,
		setPrintingMethod
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

	// function getSupportedUploadFileFormats(templateId: number, areaId: number) {
	// 	const restrictions = getTemplateUploadRestrictictions(templateId, areaId);
	// 	const fileFormats: string[] = [];

	// 	if (restrictions.isJpgAllowed) fileFormats.push('.jpg', '.jpeg');
	// 	if (restrictions.isPngAllowed) fileFormats.push('.png');
	// 	if (restrictions.isSvgAllowed) fileFormats.push('.svg');
	// 	if (restrictions.isEpsAllowed) fileFormats.push('.eps');
	// 	if (restrictions.isPdfAllowed) fileFormats.push('.pdf');

	// 	return fileFormats;
	// }
	function getSupportedUploadFileFormats(templateId: number, areaId: number) {
		// You can create custom logic here if needed based on templateId and areaId
		// For now, we’ll return a fixed set or use conditional logic

		// Example: allow everything
		const fileFormats: string[] = ['.jpg', '.jpeg', '.png', '.svg', '.eps', '.pdf'];

		// Optional: create different rules for specific template + area combinations
		// if (templateId === 123 && areaId === 456) {
		//   return ['.jpg', '.png'];
		// }

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
	const [isDarkColor, setIsDarkColor] = useState(false);

	// const handleAddTextClick = () => {
	// 	setActiveButton("text")
	// 	// setClipArt(false)
	// 	showDialog(
	// 		'add-text',
	// 		<AddTextDialog
	// 			onClose={() => closeDialog('add-text')}
	// 			onConfirm={(item) => {
	// 				addItemText(item, actualAreaId);
	// 				closeDialog('add-text');
	// 			}}
	// 		/>
	// 	);
	// };
	const handleAddTextClick = () => {
		// setActiveButton("text");
		// if outside hook, pass fonts & defaultColor as props/context

		const defaultItem: EditTextItem = {
			guid: '', // Unique ID
			name: '',
			text: "Text",
			fillColor: isDarkColor ? "white" : defaultColor,
			fontFamily: fonts[0]?.name,
			fontSize: 48,
			fontWeight: 'normal normal',
			isTextOnPath: false,
			constraints: null,
		};

		// Directly add item without showing the dialog
		addItemText(defaultItem, actualAreaId);
		setActiveButton("design")

		// Show dialog to optionally edit it
		// showDialog(
		// 	'add-text',
		// 	<AddTextDialog
		// 		onClose={() => closeDialog('add-text')}
		// 		onConfirm={(item) => {
		// 			addItemText(item, actualAreaId); // optionally re-add/replace if user edits it
		// 			closeDialog('add-text');
		// 		}}
		// 	/>
		// );
	};


	const handleAddImageFromGalleryClick = async () => {
		setClipArt(false)

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

	// Handle clip art selection (toggle selection)
	const handleAddClipArt = (image: Image) => {
		setSelectedImageIds((prev) => {
			if (prev.includes(image.imageID)) {
				// Deselect: Remove imageID
				return prev.filter((id) => id !== image.imageID);
			} else {
				// Select: Add imageID
				return [...prev, image.imageID];
			}
		});
		setActiveButton("design")

		addItemImage(image.imageID, actualAreaId);
		closeDialog('add-image');
	};


	interface Image {
		imageID: number;
		name: string;
		choiceUrl: string;
		preferredWidth: number | null;
		preferredHeight: number | null;
	}
	const { getMacroCategories, getImages } = useZakeke();
	const [isLoading, setIsloading] = useState(false);
	const [isClipArt, setClipArt] = useState(false);
	const [isDesign, setDesign] = useState(false);
	const [macroCategories, setMacroCategories] = useState<ImageMacroCategory[]>([]);
	const [selectedMacroCategory, setSelectedMacroCategory] = useState<ImageMacroCategory | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<ImageCategory | null>();
	const [images, setImages] = useState<Image[]>();
	const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
	const [activeButton, setActiveButton] = useState<string | null>('design');

	const groups = useActualGroups();
	
	// console.log(product.sku)
	// 	useEffect(() => {
	// 		if (!groups || !Array.isArray(groups)) return;
	// 		// console.log(groups)

	// 		// Find the group named "Color"
	// 		const colorGroup = groups.find(group => group.name.toLowerCase() === 'color');
	// 		// console.log("Group names:", groups.map(g => g.name));

	// console.log(colorGroup)
	// 		if (colorGroup && Array.isArray(colorGroup.attributes) && colorGroup.attributes.length > 0) {
	// 			const options = colorGroup.attributes[0].options;

	// 			if (options && Array.isArray(options)) {
	// 				const blackOption = options.find(opt => opt.name.toLowerCase() === 'black');
	// 				console.log(blackOption)

	// 				if (blackOption && blackOption.selected === true) {
	// 					setIsDarkColor(true);
	// 					return;
	// 				}
	// 			}
	// 		}

	// 		setIsDarkColor(false);
	// 	}, [groups]);
	console.log('groups-',groups)
	const hasProcessed = useRef(false);

	// Process color selection
	const processColorSelection = (groups: any) => {
		console.log("[processColorSelection] called with groups:", groups);

		const darkColors = [
			"borgoña", "negro", "marrón", "verde", "antracita metalizado",
			"borgogna", "nero", "marrone", "antracite metallizzato",
			"bourgogne", "noir", "marron", "vert", "anthracite métallisé",
			"burgundy", "black", "brown", "green", "metallic anthracite",
			"burgundrot", "schwarz", "braun", "grün", "anthrazit-metallic",
			"midnight blue", "azul noche",
		];

		if (!groups || !Array.isArray(groups)) {
			console.log("[processColorSelection] groups invalid → setIsDarkColor(false)");
			setIsDarkColor(false);
			return;
		}

		const colorGroup = groups.find((group: any) => group.name.toLowerCase() === "color");
		console.log("[processColorSelection] colorGroup:", colorGroup);

		if (colorGroup && Array.isArray(colorGroup.attributes) && colorGroup.attributes.length > 0) {
			const options = colorGroup.attributes[0].options;
			console.log("[processColorSelection] options:", options);

			if (options && Array.isArray(options)) {
				const selectedOption = options.find((opt: any) => opt.selected === true);
				console.log("[processColorSelection] selectedOption:", selectedOption);

				if (selectedOption) {
					const isDark = darkColors.includes(selectedOption.name.toLowerCase());
					console.log("[processColorSelection] isDark:", isDark);
					// setIsDarkColor(isDark);
					handleColorSelection(selectedOption.name);
					return;
				}
			}
		}

		console.log("[processColorSelection] No matching color → setIsDarkColor(false)");
		setIsDarkColor(false);
	};

	// Run processColorSelection only once when groups is first available
	useEffect(() => {
		console.log("[useEffect] fired. hasProcessed:", hasProcessed.current, "groups:", groups);

		if (!hasProcessed.current && groups.length > 0) {
			console.log("[useEffect] Running processColorSelection");
			processColorSelection(groups);
			hasProcessed.current = true;
			console.log("[useEffect] hasProcessed set to true");
		}
	}, [groups]);

	useEffect(() => {
		updateCategories();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setSelectedImageIds([]); // Clear selected images when area changes
		setActiveButton(null); // Reset activeButton to avoid showing pattern images immediately
	}, [actualAreaId]);

	const updateCategories = async () => {
		try {
			setIsloading(true);
			let macroCategories = await getMacroCategories();
			setIsloading(false);
			setMacroCategories(macroCategories);

			// if (macroCategories.length === 1)
			handleMacroCategoryClick(macroCategories[1]);
		} catch (ex) {
			console.error(ex);
		}
	}

	const handleMacroCategoryClick = async (macroCategory: ImageMacroCategory) => {
		setSelectedMacroCategory(macroCategory);

		if (macroCategory.categories.length === 1)
			handleCategoryClick(macroCategory.categories[0]);
	}

	const handleCategoryClick = async (category: ImageCategory) => {
		try {
			setIsloading(true);
			setSelectedCategory(category);

			const images: Image[] = await getImages(category.categoryID!);
			setIsloading(false);
			setImages(images);
		} catch (ex) {
			console.error(ex);
		}
	}


	const handleUploadImageClick = async (
		// addItemImage: (guid: any, imageId: number) => Promise<void>,
		// createImage: (file: File, progress?: (percentage: number) => void) => Promise<ZakekeImage>
	) => {
		if (currentTemplate && actualAreaId) {
			setActiveButton("images")
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
			setActiveButton("design")
			// document.body.appendChild(input);
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
	type FaceType = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

	// 2. Create an interface for the icon components
	interface FaceIcons {
		default: React.ComponentType;
		active: React.ComponentType;
	}

	// 3. Map all face icons with their active/inactive states
	const FACE_ICONS: Record<FaceType, FaceIcons> = {
		front: { default: FrontFace, active: FrontFaceActive },
		back: { default: BackFace, active: BackFaceActive },
		left: { default: LeftFace, active: LeftFaceActive },
		right: { default: RightFace, active: RightFaceActive },
		top: { default: TopFace, active: TopFaceActive },
		bottom: { default: BottomFace, active: BottomFaceActive },
	};
	// console.log('finalVisibleAreas', finalVisibleAreas)
	const facesData = [
		{ name: "front face", icon: <FrontFace />, activeIcon: <FrontFaceActive /> },
		{ name: "back face", icon: <BackFace />, activeIcon: <BackFaceActive /> },
		{ name: "left face", icon: <LeftFace />, activeIcon: <LeftFaceActive /> },
		{ name: "right face", icon: <RightFace />, activeIcon: <RightFaceActive /> },
		{ name: "top face", icon: <TopFace />, activeIcon: <TopFaceActive /> },
		{ name: "bottom face", icon: <BottomFace />, activeIcon: <BottomFaceActive /> },
	];

	// SKU to Default Face mapping
	const skuFaceMap: Record<string, string> = {
		"75": "top face",
		"2213": "top face",
		"5024": "top face",
		"2519": "top face",
		"706": "top face",
		"2247": "top face",
		"72": "top face",
		"2210": "top face",
		"3542": "top face",
		"2285": "top face",
		"256": "front face",
		"2221": "front face",
		"37": "front face",
		"0280": "front face",
		"854": "front face",
		"4003": "front face",
		"1004": "top face",
		"2262": "top face",
		"74": "top face",
		"2212": "top face",
		"3442": "top face",
		"2291": "top face",
		"42": "front face",
		"0436": "front face",
		"77": "front face",
		"2215": "front face",
		"66": "top face",
		"1901": "top face",
		"1005": "top face",
		"2263": "top face",
		"3187": "top face",
		"2293": "top face",
	};

	// Auto-select default face based on SKU
	useEffect(() => {
		if (!product?.sku || !finalVisibleAreas?.length) return;

		const defaultFaceName = skuFaceMap[product.sku];
		if (!defaultFaceName) return;

		const matchedArea = finalVisibleAreas.find(
			(area) => T._d(area.name).trim().toLowerCase() === defaultFaceName
		);

		if (matchedArea) {
			setActualAreaId(matchedArea.id);
		}
	}, []);


	const handleAreaClick = (id: SetStateAction<number>) => {
		setActualAreaId(id)
		setActiveButton("design")

	}



	const printingMethods = getPrintingMethods();
	console.log('-----p', printingMethods)

	const handleColorSelection = async (colorName: string) => {
		// Define engraving colors
		const engravingColors = [
			"borgoña",
			"negro",
			"marrón",
			"verde",
			"antracita metalizado",
			"borgogna",
			"nero",
			"marrone",
			"antracite metallizzato",
			"bourgogne",
			"noir",
			"marron",
			"vert",
			"anthracite métallisé",
			"burgundy",
			"black",
			"brown",
			"green",
			"metallic anthracite",
			"burgundrot",
			"schwarz",
			"braun",
			"grün",
			"anthrazit-metallic",
			"midnight blue",
			"azul noche"
		]


		// Check if selected color is engraving type
		const isEngraving = engravingColors.includes(colorName.toLowerCase());
		console.log(isEngraving)

		// Determine keyword based on color type
		const keyword = isEngraving ? "white-only" : "full-color";

		// Find matching printing method
		const method = printingMethods.find(pm =>
			pm.name.toLowerCase().includes(keyword)
		);
		console.log('Find matching printing method',method)
		if (method) {
			await setPrintingMethod(method.printMethodId, actualAreaId);
		} else {
			console.warn(`No matching printing method found for keyword: ${keyword}`);
		}
	};



	return (
		<>
			{/* {!moveElements && ( */}
			<DesignerContainer $isMobile={isMobile}>
				<div className="views">
					<button className="" onClick={() => setMoveElements(false)}
						style={{
							border: `2px solid ${!moveElements ? "#f97316" : "#6b7280"}`,
							background: "white",
							borderRadius: "10px",
							padding: "2px",
							display: "flex",
							flexDirection: "column",
							gap: '1px',
						}}>
						<span className="" style={{ color: 'black', textAlign: "center", fontSize: "12px" }}>{T._d('3D')}</span>

						<img src="/svg/3d1.svg" alt="" className="" />


						<span className="" style={{ color: 'black', textAlign: "center", fontSize: "12px" }}>							{T._d("View")}
						</span>
					</button>

					<button className="" onClick={() => setMoveElements(true)}
						style={{
							border: `2px solid ${moveElements ? "#f97316" : "#6b7280"}`,
							background: "white",
							borderRadius: "10px",
							padding: "2px",
							display: "flex",
							flexDirection: "column",
							gap: '1px',
						}}>
						<img src="/svg/edit1.svg" alt="" className="" />
						<span className="" style={{ color: 'black', textAlign: "center", fontSize: "12px" }}> {T._("Edit", "Composer")}</span>

					</button>
				</div>
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
				{/* {!isMobile && finalVisibleAreas.length > 1 && (
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
					)} */}
					{/* <h2>Testing....</h2> */}
				{finalVisibleAreas.length > 1 && (<div className="">
					<div className=""

						style={{
							color: "inherit",
							borderRadius: "11px",
							// display: "flex",
							justifyContent: "start",
							position: "relative",
							fontWeight: "500",
							fontSize: "12px",
							// alignItems: "center",
							// flexDirection: "row",
							gap: "10px",
							// Responsive styles
							...(window.innerWidth <= 768 && {
								flexDirection: "column",
								alignItems: "flex-start",
								fontSize: "10px",
							})
						}}
					>
						<span style={{
							color: "black",
							fontWeight: "700",
							fontSize: "16px",
							paddingRight: '5px',
							maxWidth: '100px',
							fontFamily: "Almarai, sans-serif"
						}}>{T._d('Die-cut faces')} </span>
						<div className=""
							style={{
								color: "inherit",
								borderRadius: "11px",
								display: "flex",
								justifyContent: "start",
								position: "relative",
								fontWeight: "500",
								fontSize: "12px",
								alignItems: "center",
								flexDirection: "row",
								gap: "1px",
							}}
						>
							{finalVisibleAreas.map((area) => {
								const isSelected = actualAreaId === area.id;
								const normalizedAreaName = T._d(area.name).trim().toLowerCase();
								// console.log('Area:', area.id, 'Name:', normalizedAreaName); // Debug
								const matchedFace = facesData.find(face =>
									face.name === normalizedAreaName
								) || facesData[0]; // Fallback to first face
								const displayName = T._d(area.name)
									.replace(/\b(Large)\b/gi, '')
									.trim();
								const Icon = isSelected ? matchedFace.activeIcon : matchedFace.icon;

								return (
									<Area
										key={area.id}
										selected={isSelected}
										onClick={() => handleAreaClick(area.id)}
									>
										{Icon}
										<span style={{ /* your styles */ }}>{T._d(displayName)}</span>
									</Area>
								);
							})}
						</div>
					</div>

					<hr />
				</div>
				)}
				{(showAddTextButton || showUploadButton || showGalleryButton) && (
					<UploadButtons>

						<div className="">
							<span style={{
								color: "black",
								fontWeight: "700",
								fontSize: "16px",
								paddingRight: '5px',
								maxWidth: '100px',
								fontFamily: "Almarai, sans-serif !important"
							}}>{T._d('Custom  tool')}</span>
						</div>

						<UploadButtonDiv>
							{showUploadButton && (
								<>
									<TextButton
										disabled={
											copyrightMessage && copyrightMessage.additionalData.enabled
												? !copyrightMandatoryCheckbox
												: false
										}
										// onClick={() => setActiveButton("images")}

										selected={activeButton === "images"}
										onClick={() => {
											handleUploadImageClick()
											setMoveElements(true);
										}}>

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
											<span style={{ paddingTop: '6px' }}>
												{itemsFiltered.some(
													(item) =>
														item.type === 1 && isItemEditable(item, currentTemplateArea)
												)
													? T._('Upload  image', 'Composer')
													: T._('Upload Images', 'Composer')}{' '}
											</span>
										</span>
									</TextButton>
								</>
							)}

							{showGalleryButton && (
								<TextButton
									selected={activeButton === "pattern"}
									onClick={() => {
										setActiveButton("pattern");
										setMoveElements(true);
									}} >
									<TextIcon>
										<svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M42.3792 4.38672H2.63711C1.74159 4.38672 1.01562 5.11877 1.01562 6.0218V32.8637C1.01562 33.7667 1.74159 34.4988 2.63711 34.4988H42.3792C43.2747 34.4988 44.0007 33.7667 44.0007 32.8637V6.0218C44.0007 5.11877 43.2747 4.38672 42.3792 4.38672Z" fill="white" stroke="#434342" />
											<path d="M29.1327 17.0156H19.7812V25.8168H29.1327V17.0156Z" fill="white" stroke="#434342" stroke-width="0.82" />
											<path d="M32.7846 28.5225C35.6212 28.5225 37.9207 26.2037 37.9207 23.3433C37.9207 20.4829 35.6212 18.1641 32.7846 18.1641C29.948 18.1641 27.6484 20.4829 27.6484 23.3433C27.6484 26.2037 29.948 28.5225 32.7846 28.5225Z" fill="white" stroke="#434342" />
											<path d="M29.7246 7.73047L31.3131 12.874H36.457L32.2952 16.0517L33.8864 21.1952L29.7246 18.0147L25.5628 21.1952L27.154 16.0517L22.9922 12.874H28.136L29.7246 7.73047Z" fill="white" stroke="#FF5733" />
											<path d="M1.00123 6.16478C1.16423 4.01928 1.32438 1.10093 8.37369 3.06188C14.302 4.70849 14.8167 1 14.8167 1L14.8453 26.5067C14.6795 28.6493 14.4392 31.8474 7.47287 29.6096C0.186194 27.268 1.02982 32.6779 1.02982 32.6779L1.00123 6.1619V6.16478Z" fill="white" stroke="#434342" stroke-width="0.92" />
										</svg>
									</TextIcon>
									<span style={{ paddingTop: '8px' }}>{T._d('Pattern')}</span>
								</TextButton>
							)}

							{showAddTextButton && (
								<TextButton onClick={() => {
									handleAddTextClick();
									setMoveElements(true);
								}}

									selected={activeButton === "text"}>
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
									<span style={{ paddingTop: '2px' }}>{T._('Text', 'Composer')}</span>
								</TextButton>
							)}
							{/* {showUploadButton && (
								<>
									<TextButton
										disabled={
											copyrightMessage && copyrightMessage.additionalData.enabled
												? !copyrightMandatoryCheckbox
												: false
										}

										// eslint-disable-next-line no-sequences
										onClick={()=>setActiveButton("design")}
										selected={activeButton === "design"}>

										<TextIcon>
											<svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M0 11.5L22 0.5L43.5 11.5L35 16L34.5 16.5L43.5 21L35.5 25L34.5 26L43.5 30.5L21.5 41.5L0.5 30.5L9.5 26L0 21L10 16.5L0 11.5Z" fill="white" stroke='black' />
												<path d="M1.08105 21.1689L1.05957 21.21L0.651367 21.001L0.998047 20.8242L1.08105 21.1689Z" fill="#434342" stroke="#434342" />
												<path d="M1.08105 30.7217L1.05957 30.7627L0.651367 30.5537L0.998047 30.376L1.08105 30.7217Z" fill="#434342" stroke="#434342" />
												<path d="M5.92218 14.5325C5.79435 14.5325 5.66653 14.4642 5.60539 14.339C5.51091 14.1568 5.5776 13.9348 5.75545 13.8381L26.5522 2.4658C26.7301 2.36904 26.9468 2.43734 27.0413 2.61948C27.1358 2.80162 27.0691 3.0236 26.8912 3.12036L6.08891 14.4869C6.03333 14.5154 5.97776 14.5325 5.92218 14.5325Z" fill="#FF5733" stroke='' />
												<path d="M11.1609 17.3154C11.0275 17.3154 10.9052 17.2414 10.8385 17.1162C10.7441 16.934 10.8163 16.712 10.9942 16.6153L32.041 5.41377C32.2189 5.317 32.4356 5.391 32.5301 5.57314C32.619 5.75527 32.5523 5.97726 32.3745 6.07402L11.3276 17.2755C11.272 17.304 11.2165 17.3154 11.1609 17.3154Z" fill="#FF5733" />
												<path d="M16.462 19.8358C16.3286 19.8358 16.2008 19.7618 16.1396 19.6309C16.0507 19.4487 16.1229 19.2268 16.3008 19.1357L37.6867 8.15616C37.8645 8.06509 38.0813 8.13909 38.1702 8.32122C38.2591 8.50336 38.1869 8.72534 38.009 8.81641L16.6231 19.7959C16.5731 19.8244 16.5175 19.8358 16.462 19.8358Z" fill="#FF5733" />
												<mask id="path-7-inside-1_6317_5462" fill="black" stroke='black'>
													<path d="M22.0028 22.8968C21.9472 22.8968 21.8916 22.8854 21.8416 22.857L0.200076 11.7807C0.0778073 11.7181 0 11.5928 0 11.4505C0 11.3082 0.0778073 11.183 0.200076 11.1204L21.8416 0.0384198C21.9416 -0.0128066 22.0639 -0.0128066 22.164 0.0384198L43.7999 11.1204C43.9222 11.183 44 11.3082 44 11.4505C44 11.5928 43.9222 11.7181 43.7999 11.7807L22.164 22.857C22.1139 22.8854 22.0584 22.8968 22.0028 22.8968ZM1.16711 11.4505L21.9972 22.117L42.8273 11.4505L22.0028 0.784049L1.16711 11.4505Z" />
												</mask>
												<path d="M22.0028 22.8968C21.9472 22.8968 21.8916 22.8854 21.8416 22.857L0.200076 11.7807C0.0778073 11.7181 0 11.5928 0 11.4505C0 11.3082 0.0778073 11.183 0.200076 11.1204L21.8416 0.0384198C21.9416 -0.0128066 22.0639 -0.0128066 22.164 0.0384198L43.7999 11.1204C43.9222 11.183 44 11.3082 44 11.4505C44 11.5928 43.9222 11.7181 43.7999 11.7807L22.164 22.857C22.1139 22.8854 22.0584 22.8968 22.0028 22.8968ZM1.16711 11.4505L21.9972 22.117L42.8273 11.4505L22.0028 0.784049L1.16711 11.4505Z" fill="#434342" />
												<path d="M21.8416 22.857L22.8307 21.1186L22.7922 21.0968L22.7528 21.0766L21.8416 22.857ZM0.200076 11.7807L-0.7115 13.5608L-0.711129 13.561L0.200076 11.7807ZM0.200076 11.1204L1.11165 12.9006L0.200076 11.1204ZM21.8416 0.0384198L20.93 -1.74176L21.8416 0.0384198ZM22.164 0.0384198L23.0757 -1.74166L23.0755 -1.74176L22.164 0.0384198ZM43.7999 11.1204L42.8882 12.9005L42.8883 12.9006L43.7999 11.1204ZM43.7999 11.7807L44.7113 13.5609L44.7115 13.5608L43.7999 11.7807ZM22.164 22.857L21.2526 21.0767L21.2133 21.0968L21.1749 21.1186L22.164 22.857ZM1.16711 11.4505L0.255725 9.67026L-3.22136 11.4503L0.255533 13.2307L1.16711 11.4505ZM21.9972 22.117L21.0856 23.8972L21.9972 24.364L22.9088 23.8972L21.9972 22.117ZM42.8273 11.4505L43.7389 13.2307L47.2149 11.4508L43.7391 9.67046L42.8273 11.4505ZM22.0028 0.784049L22.9145 -0.996029L22.003 -1.46292L21.0914 -0.996226L22.0028 0.784049ZM22.0028 22.8968V20.8968C22.2171 20.8968 22.5188 20.9412 22.8307 21.1186L21.8416 22.857L20.8526 24.5953C21.2645 24.8297 21.6774 24.8968 22.0028 24.8968V22.8968ZM21.8416 22.857L22.7528 21.0766L1.11128 10.0003L0.200076 11.7807L-0.711129 13.561L20.9304 24.6373L21.8416 22.857ZM0.200076 11.7807L1.11165 10.0005C1.65983 10.2812 2 10.8448 2 11.4505H0H-2C-2 12.3408 -1.50421 13.1549 -0.7115 13.5608L0.200076 11.7807ZM0 11.4505H2C2 12.0563 1.65983 12.6199 1.11165 12.9006L0.200076 11.1204L-0.7115 9.34023C-1.50421 9.74616 -2 10.5602 -2 11.4505H0ZM0.200076 11.1204L1.11165 12.9006L22.7532 1.8186L21.8416 0.0384198L20.93 -1.74176L-0.7115 9.34023L0.200076 11.1204ZM21.8416 0.0384198L22.7532 1.8186C22.2808 2.06047 21.7247 2.06047 21.2524 1.8186L22.164 0.0384198L23.0755 -1.74176C22.4031 -2.08608 21.6024 -2.08608 20.93 -1.74176L21.8416 0.0384198ZM22.164 0.0384198L21.2522 1.8185L42.8882 12.9005L43.7999 11.1204L44.7117 9.34033L23.0757 -1.74166L22.164 0.0384198ZM43.7999 11.1204L42.8883 12.9006C42.3402 12.6199 42 12.0563 42 11.4505H44H46C46 10.5602 45.5042 9.74615 44.7115 9.34023L43.7999 11.1204ZM44 11.4505H42C42 10.8448 42.3402 10.2812 42.8883 10.0005L43.7999 11.7807L44.7115 13.5608C45.5042 13.1549 46 12.3408 46 11.4505H44ZM43.7999 11.7807L42.8885 10.0004L21.2526 21.0767L22.164 22.857L23.0753 24.6372L44.7113 13.5609L43.7999 11.7807ZM22.164 22.857L21.1749 21.1186C21.4868 20.9412 21.7885 20.8968 22.0028 20.8968V22.8968V24.8968C22.3282 24.8968 22.7411 24.8297 23.153 24.5953L22.164 22.857ZM1.16711 11.4505L0.255533 13.2307L21.0856 23.8972L21.9972 22.117L22.9088 20.3368L2.07868 9.67036L1.16711 11.4505ZM21.9972 22.117L22.9088 23.8972L43.7389 13.2307L42.8273 11.4505L41.9158 9.67036L21.0856 20.3368L21.9972 22.117ZM42.8273 11.4505L43.7391 9.67046L22.9145 -0.996029L22.0028 0.784049L21.091 2.56413L41.9156 13.2306L42.8273 11.4505ZM22.0028 0.784049L21.0914 -0.996226L0.255725 9.67026L1.16711 11.4505L2.07849 13.2308L22.9142 2.56432L22.0028 0.784049Z" fill="#434342" mask="url(#path-7-inside-1_6317_5462)" />
											</svg>
										</TextIcon>
										<span>
											<span style={{ paddingTop: '6px' }}>
												{itemsFiltered.some(
													(item) =>
														item.type === 1 && isItemEditable(item, currentTemplateArea)
												)
													? T._('Design', 'Composer')
													: T._('Design', 'Composer')}{' '}
											</span>
										</span>
									</TextButton>
								</>
							)} */}


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
						</UploadButtonDiv>
					</UploadButtons>
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
				{/* Text Items and Add More Button */}
				{/* {moveElements && activeButton === 'text' && showAddTextButton && (
					<div>
						{itemsFiltered.map((item) => {
							if (item.type === 0 && isItemEditable(item, currentTemplateArea)) {
								return (
									<ItemText
										key={item.guid}
										handleItemPropChange={handleItemPropChange}
										item={item as TextItem}
										setMoveElements={setMoveElements}
									/>
								);
							}
							return null;
						})}
						
						{ itemsFiltered.filter(
								(item) => item.type === 0 && isItemEditable(item, currentTemplateArea)
							).length > 0 && (
							<AddMoreButton onClick={handleAddTextClick}>+ Add more text</AddMoreButton>
						)}
					</div>
				)} */}

				{/* {moveElements && activeButton === 'images' && showAddTextButton && (
					<div>
						<div onClick={() => handleUploadImageClick(addItemImage, createImage)} style={{display:'flex' , gap:'10px', alignItems:"center" , justifyContent:"center", cursor:"pointer", paddingTop:"10px"}} >
							<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="0.5" y="0.5" width="27" height="27" rx="4.5" fill="white" stroke="#434342" />
								<g clip-path="url(#clip0_6317_5074)">
									<path d="M21.3448 6.60156H6.64844V21.4348H21.3448V6.60156Z" fill="white" stroke="#434342" stroke-miterlimit="10" />
									<path d="M21.4807 18.4877L18.3788 16.1754L16.6271 18.0805L9.75031 12.3633L6.64844 15.359V21.4834H21.4807V18.4877Z" fill="#434342" />
									<path d="M18.6529 11.5028C19.3975 11.5028 20.0011 10.8935 20.0011 10.142C20.0011 9.39048 19.3975 8.78125 18.6529 8.78125C17.9083 8.78125 17.3047 9.39048 17.3047 10.142C17.3047 10.8935 17.9083 11.5028 18.6529 11.5028Z" fill="#434342" />
									<path d="M6.67188 6.08717V4" stroke="#FF5733" stroke-miterlimit="10" />
									<path d="M6.67188 24.0012V21.9141" stroke="#FF5733" stroke-miterlimit="10" />
									<path d="M6.06792 6.66016H4" stroke="#FF5733" stroke-miterlimit="10" />
									<path d="M6.06792 21.3516H4" stroke="#FF5733" stroke-miterlimit="10" />
									<path d="M21.3125 21.9141V24.0012" stroke="#FF5733" stroke-miterlimit="10" />
									<path d="M21.9375 21.3516H24.0034" stroke="#FF5733" stroke-miterlimit="10" />
									<path d="M21.3125 4V6.08717" stroke="#FF5733" stroke-miterlimit="10" />
									<path d="M21.7656 6.66016H23.8335" stroke="#FF5733" stroke-miterlimit="10" />
								</g>
								<defs>
									<clipPath id="clip0_6317_5074">
										<rect width="20" height="20" fill="white" transform="translate(4 4)" />
									</clipPath>
								</defs>
							</svg>
							Upload image 
							<svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="8.5" cy="8.5" r="8.5" fill="#FF5733" />
								<path d="M9.53321 7.492H13.1152V9.418H9.53321V13H7.60721V9.418H4.02521V7.492H7.60721V3.91H9.53321V7.492Z" fill="white" />
							</svg>
</div>

						{itemsFiltered.map((item) => {
							if (item.type === 1 && isItemEditable(item, currentTemplateArea))
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
								)
							return null;
						})}

					
					</div>
				)} */}
				{activeButton === 'pattern' && showGalleryButton && selectedCategory && images && (
					<>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<div className="">
								<div className="" style={{ color: "black", display: 'flex', flexWrap: "wrap", alignItems: 'center', position: 'relative', width: '100%', gap: '10px', justifyContent: 'space-between' }}>
										<h2 className="">{T._d('Pattern')}</h2>
									<button style={{ background: 'white', border: "0" }} onClick={() => setActiveButton("design")} className=""><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M5 13L13 5M5 5L13 13" stroke="#434342" stroke-linejoin="round" />
										<circle cx="9" cy="9" r="8.5" stroke="#434342" />
									</svg>
									</button>
								</div>
								<ImagesList>

									{images.map((image) => (
										<ImageItem1
											isActive={selectedImageIds.includes(image.imageID)}
											key={image.imageID.toString()}
											onClick={() => handleAddClipArt(image)}
										>
											<img src={image.choiceUrl} alt={image.name} />
											{/* <span>{image.name}</span> */}
										</ImageItem1>
									))}
								</ImagesList>
							</div>
						)}
					</>
				)}


				{activeButton !== "pattern" && itemsFiltered.map((item) => {
					if (item.type === 0 && isItemEditable(item, currentTemplateArea))
						return (
							// <ItemText
							// 	key={item.guid}
							// 	handleItemPropChange={handleItemPropChange}
							// 	item={item as TextItem}
							// 	setMoveElements={setMoveElements}
							// />
							<ItemText2
								isDarkColor={isDarkColor}
								key={item.guid}
								handleItemPropChange={handleItemPropChange}
								item={item as TextItem}
								setMoveElements={setMoveElements}
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



				{/* {itemsFiltered.length > 0 && !allStaticElements && (
						<MoveElementButton isFullWidth outline onClick={() => setMoveElements(true)}>
							<Icon>
								<Arrows />
							</Icon>
							<span>{T._('Move elements', 'Composer')} </span>
						</MoveElementButton>
					)} */}
				{/* {isMobile && <CloseEditorButton onClick={onCloseClick}>{T._('OK', 'Composer')}</CloseEditorButton>} */}
			</DesignerContainer>
			{/* )} */}
			{moveElements && (
				<ZakekeDesignerContainer $isMobile={isMobile} className="zakeke-container">
					{/* <div className="" style={{background:"black"}}> */}
					<ZakekeDesigner ref={customizerRef} areaId={actualAreaId} />

					{/* </div> */}
				</ZakekeDesignerContainer>
			)}
		</>
	);
};

export default Designer;