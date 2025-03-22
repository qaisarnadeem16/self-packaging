import { Option, Step, ThemeTemplateGroup, useZakeke, Group } from '@zakeke/zakeke-configurator-react';
//import { T, useActualGroups, useUndoRedoActions, useUndoRegister } from '../../../Helpers';
import { useActualGroups } from '../../../Helpers';
import { Map } from 'immutable';
import React, { useEffect, useState } from 'react';
import useStore from '../../../Store';
import styled from 'styled-components/macro';
import savedCompositionsIcon from '../../../assets/icons/arrow-right-solid.svg';
import star from '../../../assets/icons/star.svg';
import noImage from '../../../assets/images/no_image.png';
import Designer from '../Designer';
import DesignsDraftList from '../DesignsDraftList';
import { ItemName, SelectorMobileContainer, StepsMobileContainer, Template, TemplatesContainer } from '../LayoutStyles';
import Steps from '../Steps';
import { MenuItem, MobileItemsContainer } from './SelectorMobileComponents';
import TemplateGroup from '../../widgets/TemplateGroup';

const PriceInfoTextContainer = styled.div`
	font-size: 14px;
	padding: 0px 10px;
`;

const SelectorMobile = () => {
	const {
		isSceneLoading,
		templates,
		currentTemplate,
		setCamera,
		setTemplate,
		sellerSettings,
		selectOption,
		draftCompositions,
		setExplodedMode,
		product
	} = useZakeke();
	const {
		selectedGroupId,
		setSelectedGroupId,
		selectedAttributeId,
		setSelectedAttributeId,
		selectedStepId,
		setSelectedStepId,
		isUndo,
		isRedo,
		setSelectedTemplateGroupId,
		selectedTemplateGroupId,
		lastSelectedItem,
		setLastSelectedItem
	} = useStore();
	const [scrollLeft, setScrollLeft] = useState<number | null>(null);
	const [optionsScroll, setOptionsScroll] = useState<number | null>(null);
	const [attributesScroll, setAttributesScroll] = useState<number | null>(null);
	const [isTemplateEditorOpened, setIsTemplateEditorOpened] = useState(false);
	const [isDesignsDraftListOpened, setisDesignsDraftListOpened] = useState(false);
	const [isTemplateGroupOpened, setIsTemplateGroupOpened] = useState(false);
	const [isStartRegistering, setIsStartRegistering] = useState(false);
	// const undoRegistering = useUndoRegister();
	// const undoRedoActions = useUndoRedoActions();

	let actualGroups = useActualGroups() ?? [];

	const idsToRemove = [10483, 10482, -1];

	idsToRemove.push (10640) // id to remove on only blazer product 

    actualGroups = actualGroups.filter(obj => !idsToRemove.includes(obj.id));

	const customizeGroup: Group = {
		id: -2,
		guid: '0000-0000-0000-0000',
		name: 'LINING TEXT',
		enabled: true,
		attributes: [],
		steps: [],
		cameraLocationId: '4f500be3-14f3-4226-cfd6-e1bbf4e390d4',
		displayOrder: actualGroups.length - 1,
		direction: 0,
		attributesAlwaysOpened: false,
		imageUrl: 'https://media.cdn.zakeke.com/cdn/images/customize_button/119348/cea408a2ebe144cdab67ac6140cbf38e.png',
		templateGroups: [],
	};
  

	if(!isSceneLoading){
		if (product?.name != 'FlexFabrix™ By DA Dress Pants') actualGroups.push(customizeGroup);
		// actualGroups.push(customizeGroup);
		}
	
	const selectedGroup = selectedGroupId ? actualGroups.find((group) => group.id === selectedGroupId) : null;
	const selectedStep = selectedGroupId
		? actualGroups.find((group) => group.id === selectedGroupId)?.steps.find((step) => step.id === selectedStepId)
		: null;
	const currentAttributes = selectedStep ? selectedStep.attributes : selectedGroup ? selectedGroup.attributes : [];
	const currentTemplateGroups = selectedStep
		? selectedStep.templateGroups
		: selectedGroup
		? selectedGroup.templateGroups
		: [];

	const currentItems = [...currentAttributes, ...currentTemplateGroups].sort(
		(a, b) => a.displayOrder - b.displayOrder
	);
	// const [lastSelectedItem, setLastSelectedItem] = useState<{ type: string; id: number | null }>();

	const selectedAttribute = currentAttributes
		? currentAttributes.find((attr) => attr.id === selectedAttributeId)
		: null;

	const selectedTemplateGroup = currentTemplateGroups
		? currentTemplateGroups.find((templGr) => templGr.templateGroupID === selectedTemplateGroupId)
		: null;

	const options = selectedAttribute?.options ?? [];
	const groupIndex = actualGroups && selectedGroup ? actualGroups.indexOf(selectedGroup) : 0;

	const [lastSelectedSteps, setLastSelectedSteps] = useState(Map<number, number>());

	// console.log(options,'options');
	
	const handleNextGroup = () => {
		if (selectedGroup) {
			if (groupIndex < actualGroups.length - 1) {
				const nextGroup = actualGroups[groupIndex + 1];
				handleGroupSelection(nextGroup.id);
			}
		}
	};

	const handlePreviousGroup = () => {
		if (selectedGroup) {
			if (groupIndex > 0) {
				let previousGroup = actualGroups[groupIndex - 1];
				handleGroupSelection(previousGroup.id);

				// Select the last step
				if (previousGroup.steps.length > 0)
					handleStepSelection(previousGroup.steps[previousGroup.steps.length - 1].id);
			}
		}
	};

	const handleStepChange = (step: Step | null) => {
		if (step) handleStepSelection(step.id);
	};

	const handleGroupSelection = (groupId: number | null) => {
		// setIsStartRegistering(undoRegistering.startRegistering());

		// if (groupId && selectedGroupId !== groupId && !isUndo && !isRedo) {
		// 	undoRedoActions.eraseRedoStack();
		// 	undoRedoActions.fillUndoStack({ type: 'group', id: selectedGroupId, direction: 'undo' });
		// 	undoRedoActions.fillUndoStack({ type: 'group', id: groupId, direction: 'redo' });
		// }

		setSelectedGroupId(groupId);
		// console.log(selecte);
		
	};

	const handleStepSelection = (stepId: number | null) => {
		// setIsStartRegistering(undoRegistering.startRegistering());

		// if (selectedStepId !== stepId && !isUndo && !isRedo) {
		// 	undoRedoActions.eraseRedoStack();
		// 	undoRedoActions.fillUndoStack({ type: 'step', id: selectedStepId, direction: 'undo' });
		// 	undoRedoActions.fillUndoStack({ type: 'step', id: stepId ?? null, direction: 'redo' });
		// }

		setSelectedStepId(stepId);

		const newStepSelected = lastSelectedSteps.set(selectedGroupId!, stepId!);
		setLastSelectedSteps(newStepSelected);
	};

	const handleAttributeSelection = (attributeId: number) => {
		// setIsStartRegistering(undoRegistering.startRegistering());

		// if (attributeId && selectedAttributeId !== attributeId && !isUndo && !isRedo) {
		// 	undoRedoActions.eraseRedoStack();
		// 	undoRedoActions.fillUndoStack({ type: 'attribute', id: selectedAttributeId, direction: 'undo' });
		// 	undoRedoActions.fillUndoStack({ type: 'attribute', id: attributeId, direction: 'redo' });
		// }

		setSelectedAttributeId(attributeId);
		setLastSelectedItem({ type: 'attribute', id: attributeId });
	};

	const handleTemplateGroupSelection = (templateGroupId: number | null) => {
		setSelectedTemplateGroupId(templateGroupId);
		setLastSelectedItem({ type: 'template-group', id: templateGroupId });
		setIsTemplateGroupOpened(true);
	};

	const handleOptionSelection = (option: Option) => {
		// const undo = undoRegistering.startRegistering();
		// undoRedoActions.eraseRedoStack();
		// undoRedoActions.fillUndoStack({
		// 	type: 'option',
		// 	id: options.find((opt) => opt.selected)?.id ?? null,
		// 	direction: 'undo'
		// });
		// undoRedoActions.fillUndoStack({ type: 'option', id: option.id, direction: 'redo' });

		setCamera(option.attribute.cameraLocationId!);
		selectOption(option.id);
		// undoRegistering.endRegistering(undo);

		try {
			if ((window as any).algho) (window as any).algho.sendUserStopForm(true);
		} catch (e) {}
	};

	// Initial template selection
	useEffect(() => {
		if (templates.length > 0 && !currentTemplate) setTemplate(templates[0].id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [templates]);

	// auto-selection if there is only 1 group
	useEffect(() => {
		if (actualGroups && actualGroups.length === 1 && actualGroups[0].id === -2) return;
		else if (actualGroups && actualGroups.length === 1 && !selectedGroupId) setSelectedGroupId(actualGroups[0].id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actualGroups, selectedGroupId]);

	// Reset attribute selection when group selection changes
	useEffect(() => {
		if (selectedGroup && selectedGroup.id !== -2) {
			if (selectedGroup.steps.length > 0) {
				if (lastSelectedSteps.get(selectedGroupId!))
					handleStepSelection(lastSelectedSteps.get(selectedGroupId!)!);
				else {
					handleStepSelection(selectedGroup.steps[0].id);
					if (
						selectedGroup.steps[0].attributes.length === 1 &&
						selectedGroup.steps[0].templateGroups.length === 0
					)
						handleAttributeSelection(selectedGroup.steps[0].attributes[0].id);
					else if (
						selectedGroup.steps[0].templateGroups.length === 1 &&
						selectedGroup.steps[0].attributes.length === 0
					)
						handleTemplateGroupSelection(selectedGroup.steps[0].templateGroups[0].templateGroupID);
				}
			} else {
				handleStepSelection(null);
				if (selectedGroup.attributes.length === 1 && selectedGroup.templateGroups.length === 0)
					handleAttributeSelection(selectedGroup.attributes[0].id);
				else if (selectedGroup.templateGroups.length === 1 && selectedGroup.attributes.length === 0)
					handleTemplateGroupSelection(selectedGroup.templateGroups[0].templateGroupID);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedGroup?.id]);

	useEffect(() => {
		if (selectedGroup?.id === -2) {
			setIsTemplateEditorOpened(true);
		}
	}, [selectedGroup?.id]);

	useEffect(() => {
		if (selectedGroup?.id === -3) {
			setisDesignsDraftListOpened(true);
		}
	}, [selectedGroup?.id]);

	// Camera
	useEffect(() => {
		if (!isSceneLoading && selectedGroup && selectedGroup.cameraLocationId) {
			setCamera(selectedGroup.cameraLocationId);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedGroup?.id, isSceneLoading]);

	useEffect(() => {
		if (selectedGroup && selectedGroup.steps.length > 0) {
			if (
				selectedGroup.steps.find((step) => step.id === selectedStep?.id) &&
				selectedGroup.steps.find((step) => step.id === selectedStep?.id)?.attributes.length === 1 &&
				selectedGroup.steps.find((step) => step.id === selectedStep?.id)?.templateGroups.length === 0
			)
				handleAttributeSelection(
					selectedGroup.steps!.find((step) => step.id === selectedStep?.id)!.attributes[0].id
				);
			else setSelectedAttributeId(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStep?.id]);

	return (
		<SelectorMobileContainer>
			{sellerSettings && sellerSettings.priceInfoText && (
				<PriceInfoTextContainer dangerouslySetInnerHTML={{ __html: sellerSettings.priceInfoText }} />
			)}

			{selectedGroup && selectedGroup.id !== -2 && selectedGroup.steps && selectedGroup.steps.length > 0 && (
				<StepsMobileContainer>
					<Steps
						key={'steps-' + selectedGroup?.id}
						hasNextGroup={groupIndex !== actualGroups.length - 1}
						hasPreviousGroup={groupIndex !== 0}
						onNextStep={handleNextGroup}
						onPreviousStep={handlePreviousGroup}
						currentStep={selectedStep}
						steps={selectedGroup.steps}
						onStepChange={handleStepChange}
					/>
				</StepsMobileContainer>
			)}
			{selectedGroup == null && (
				<MobileItemsContainer
					isLeftArrowVisible
					isRightArrowVisible
					scrollLeft={scrollLeft ?? 0}
					onScrollChange={(value) => setScrollLeft(value)}
				>
					{actualGroups.map((group) => {
						if (group)
							return (
								<MenuItem
									key={group.guid}
									imageUrl={
										group.id === -3 ? savedCompositionsIcon : group.imageUrl ? group.imageUrl : star
									}
									label={group.name ? group.name : 'Customize'}
									onClick={() => {
										handleGroupSelection(group.id)

										if(group.name.toLowerCase() === 'pant'){
											setExplodedMode(true)
										  }else {
											setExplodedMode(false)
										  }

										  if (product?.name === 'FlexFabrix™ By DA Suit') {
											if(group.name.toLowerCase() === 'blazer view' || group.name.toLowerCase() === 'lining text'){
											  selectOption(1363645); // Open jacket comm                    
											}
											else {
											  selectOption(1363646);
											}  
										  }
						
										  if (product?.name === 'FlexFabrix™ By DA Blazer'){
											if(group.name.toLowerCase() === 'blazer view' || group.name.toLowerCase() === 'lining text'){
											  selectOption(1382103); // Open jacket comm                    
											}
											else {
											  selectOption(1382104);
											}  
										  }
										
									}}
								></MenuItem>
							);
						else return null;
					})}
				</MobileItemsContainer>
			)}

			{/* <AttributesContainer > */}
			{selectedGroup && selectedGroup.id === -2 && templates.length > 1 && (
				<TemplatesContainer>
					{templates.map((template) => (
						<Template
							key={template.id}
							selected={currentTemplate === template}
							onClick={() => {
								setTemplate(template.id);
							}}
						>
							{template.name}
						</Template>
					))}
				</TemplatesContainer>
			)}
			{selectedGroup && (
				<MobileItemsContainer
					isLeftArrowVisible
					isRightArrowVisible
					scrollLeft={attributesScroll ?? 0}
					onScrollChange={(value) => setAttributesScroll(value)}
				>
					{/* Attributes */}

					{selectedGroup &&
						!selectedAttributeId &&
						!selectedTemplateGroupId &&
						currentItems &&
						currentItems.map((item) => {
							if (!(item instanceof ThemeTemplateGroup))
								return (
									<MenuItem
										selected={item.id === selectedAttributeId}
										key={item.guid}
										onClick={() => handleAttributeSelection(item.id)}
										images={item.options
											.slice(0, 4)
											.map((x) => (x.imageUrl ? x.imageUrl : noImage))}
										label={item.name}
										isRound={item.optionShapeType === 2}
									>
										<ItemName> {item.name.toUpperCase()} </ItemName>
									</MenuItem>
								);
							else
								return (
									<MenuItem
										selected={item.templateGroupID === selectedTemplateGroupId}
										key={item.templateGroupID}
										onClick={() => handleTemplateGroupSelection(item.templateGroupID)}
										imageUrl={noImage}
										label={item.name}
										isRound={false}
									>
										<ItemName> {item.name.toUpperCase()} </ItemName>
									</MenuItem>
								);
						})}
					{/* </CarouselContainer> */}

					{/* Options */}
					<MobileItemsContainer
						isLeftArrowVisible={options.length !== 0}
						isRightArrowVisible={options.length !== 0}
						scrollLeft={optionsScroll ?? 0}
						onScrollChange={(value) => setOptionsScroll(value)}
					>
						{lastSelectedItem?.type === 'attribute' ? (
							<>
								{selectedAttribute &&
									selectedAttribute.options.map(
										(option) =>
											option.enabled && (
												<MenuItem
													isRound={selectedAttribute.optionShapeType === 2}
													description={option.description}
													selected={option.selected}
													imageUrl={option.imageUrl ?? ''}
													label={option.name}
													hideLabel={selectedAttribute.hideOptionsLabel}
													key={option.guid}
													onClick={() => handleOptionSelection(option)}
												/>
											)
									)}
							</>
						) : (
							selectedTemplateGroup &&
							isTemplateGroupOpened && (
								<TemplateGroup
									key={selectedTemplateGroupId}
									templateGroup={selectedTemplateGroup!}
									isMobile
									onCloseClick={() => {
										setIsTemplateGroupOpened(false);
										handleTemplateGroupSelection(null);
										handleGroupSelection(null);
									}}
								/>
							)
						)}
					</MobileItemsContainer>
				</MobileItemsContainer>
			)}

			{/* Designer / Customizer */}
			{selectedGroup?.id === -2 && isTemplateEditorOpened && (
				<Designer
					onCloseClick={() => {
						setIsTemplateEditorOpened(false);
						handleGroupSelection(null);
					}}
				/>
			)}

			{/* Saved Compositions */}
			{draftCompositions && selectedGroup?.id === -3 && isDesignsDraftListOpened && (
				<DesignsDraftList
					onCloseClick={() => {
						setIsTemplateEditorOpened(false);
						handleGroupSelection(null);
					}}
				/>
			)}
		</SelectorMobileContainer>
	);
};

export default SelectorMobile;
