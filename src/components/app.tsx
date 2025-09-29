import React, { FunctionComponent, useState, Component, useEffect } from 'react';
import styled from 'styled-components';
import { ZakekeEnvironment, ZakekeViewer, ZakekeProvider } from '@zakeke/zakeke-configurator-react';
import Selector from './selector';
import Viewer from '../pages/Viewer/Viewer';
import useStore from '../Store';
import LayoutMobile from '../LayoutMobile';
import { DialogsRenderer } from "./dialogs/Dialogs";
import { useZakeke } from 'zakeke-configurator-react';

// const Layout = styled.div`
//     display: grid;
//     grid-template-columns: 1fr 0.6fr;
//     // grid-gap: 40px;
//     height: 100%;
//     padding: 40px;
// `;

interface ErrorBoundaryProps {
	// You can add other props specific to your error boundary if needed
  }

interface ErrorBoundaryState {
	hasError: boolean;
  }

class ErrorBoundary extends Component<React.PropsWithChildren<ErrorBoundaryProps>, ErrorBoundaryState>  {
	constructor(props:any) {
	  super(props);
	  this.state = { hasError: false };
	}
  
	static getDerivedStateFromError(error:any) {
	  return { hasError: true };
	}
  
	componentDidCatch(error:any, errorInfo:any) {
	  // Log the error or send it to an error tracking service
	  console.error('Error caught by error boundary:', error, errorInfo);
	}
  
	render() {
	  if (this.state.hasError) {
		// You can render a fallback UI here
		return <p>Something went wrong. Please try again later.</p>;
	  }
  
	  return this.props.children;
	}
  }
  
const zakekeEnvironment = new ZakekeEnvironment();

const App: FunctionComponent<{}> = () => {
    const {
		isLoading,
		setPriceFormatter,
		setSelectedAttributeId,
		setSelectedGroupId,
		setSelectedStepId,
		isMobile,
		selectedGroupId,
		setIsMobile,
		setNotifications,
		setLastSelectedItem ,

		tagsOfSavedDesigns,
		setTagsOfSavedDesigns
	} = useStore();
	const {
		draftCompositions
	} = useZakeke();
	// Tags save from saved compositions
	useEffect(() => {
		if (tagsOfSavedDesigns && tagsOfSavedDesigns.length === 0 && draftCompositions && draftCompositions.length > 0) {
			let tempTags: string[] = [];

			if (draftCompositions && draftCompositions.length > 0) {
				draftCompositions.forEach((composition) => {
					if (composition.tags) {
						const actualTags = composition.tags;
						tempTags.push(...actualTags);
					}
				});
			}

			let filteredTags = Array.from(new Set(tempTags));
			setTagsOfSavedDesigns(filteredTags);
			console.log('useeffect tagssaveddesign', tagsOfSavedDesigns);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [draftCompositions]);
    return (
		<ErrorBoundary>
			<ZakekeProvider environment={zakekeEnvironment}>
				<Viewer />
				{/* {isMobile ? <LayoutMobile /> : <Viewer /> } */}
				{/* <Layout> */}
					{/* <Viewer /> */}
					{/* <Selector /> */}
				{/* </Layout> */}
				<DialogsRenderer />
			</ZakekeProvider>
		</ErrorBoundary>
	);
}

export default App; 