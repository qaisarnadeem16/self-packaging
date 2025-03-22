import { Icon } from "../../Atomic";
import React, { FC, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import ArrowLeftIcon from '../../../assets/icons/arrow-left-solid';
import ArrowRightIcon from '../../../assets/icons/arrow-right-solid';
import { MenuItemIcon, MenuItemImage, MenuItemImagesImage, MenuItemImagesImageWrapper, MenuItemImagesWrapper, MenuItemLabel, MobileItemContainer } from "../LayoutStyles";
import noImage from '../../../assets/images/no_image.png';

const getVisibleArrows = (div: HTMLDivElement) => {
    let showLeft = false;
    let showRight = false;

    if (div.scrollLeft > 0)
        showLeft = true;

    if (div.scrollWidth - div.clientWidth > div.scrollLeft)
        showRight = true;

    return [showLeft, showRight];
}

interface MenuItemsContainerProps {
    isLeftArrowVisible: boolean;
    isRightArrowVisible: boolean;
    onScrollChange: (value: number) => void;
    scrollLeft: number;
    children?: React.ReactNode;
}

interface MenuItemProps {
    selected?: boolean;
    imageUrl?: string | null;
    icon?: React.ReactNode | string | null | undefined;
    label: string;
    onClick: () => void;
    className?: string;
    images?: string[];
    hideLabel?: boolean;
    description?: string | null;
    isRound?: boolean;
    children?: React.ReactNode;
}


const MenuItemsWrapper = styled.div`
    display: flex;
    max-width: 100%;
    min-height: 141px;
    width: 100%;
    overflow-x: auto;
    background-color: #ffffff ;
    border-top: 1px #ffffff  solid;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    ::-webkit-scrollbar {
        display: none;
    }

    span{
        font-size:16px;
    }
`;

const ArrowCss = css`
    position: absolute;
    left: 10px;
    bottom: 60px;
    background-color: #F1F1F1;
    border-radius: 30px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`;

const ArrowLeft = styled.div`
${ArrowCss};
`;
const ArrowRight = styled.div`
${ArrowCss};
left: auto;
right: 10px;
`;

const ArrowLeftIconStyled = styled(Icon)`
 font-size: 22px;
`;

const ArrowRightIconStyled = styled(Icon)`
 font-size: 22px;
`;


export const MobileItemsContainer: FC<MenuItemsContainerProps> = ({ children, isLeftArrowVisible, isRightArrowVisible, onScrollChange, scrollLeft }) => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const ref = useRef<HTMLDivElement | null>(null);
    if (ref.current && scrollLeft != null)
        ref.current.scrollLeft = scrollLeft ?? 0;

    // Update visibility on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                onScrollChange(ref.current.scrollLeft);
                const [showLeft, showRight] = getVisibleArrows(ref.current);
                setShowLeftArrow(showLeft);
                setShowRightArrow(showRight);
            }
        }

        // Initial visiblity
        handleScroll();

        const actualRef = ref.current;
        // console.log(actualRef,'actualRef');
        
        actualRef?.addEventListener('scroll', handleScroll);
        return () => actualRef?.removeEventListener('scroll', handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <MenuItemsWrapper ref={ref}>
        {showLeftArrow && isLeftArrowVisible && (
            <ArrowLeft>
                <ArrowLeftIconStyled>
                 <ArrowLeftIcon /> 
                </ArrowLeftIconStyled> 
            </ArrowLeft>
        )}

        {/* Content */}
        {children}

        {showRightArrow && isRightArrowVisible && (
            <ArrowRight>
                <ArrowRightIconStyled><ArrowRightIcon /></ArrowRightIconStyled>
            </ArrowRight>
        )}
    </MenuItemsWrapper>;
}
export const MenuItem: FC<MenuItemProps> = props => {

    return <MobileItemContainer onClick={props.onClick} selected={props.selected}>

        {props.imageUrl && <MenuItemImage isRound={props.isRound} src={props.imageUrl} alt={props.label} loading="lazy" />}
        {(!props.imageUrl && props.icon) && <MenuItemIcon>{props.icon}</MenuItemIcon>}
        {
            props.images && <MenuItemImagesWrapper>
                {[0, 0, 0, 0].map((_, index) => <MenuItemImagesImageWrapper key={index}>
                    {props.images!.length > index && <MenuItemImagesImage isRound={props.isRound} src={props.images ? props.images[index] : noImage} alt={props.label} loading="lazy" />}
                </MenuItemImagesImageWrapper>)}
            </MenuItemImagesWrapper>
        }
        {!props.hideLabel && <MenuItemLabel>{props.label}</MenuItemLabel>}

    </MobileItemContainer >;
}