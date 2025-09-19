import React, { useEffect, useRef, useState } from 'react'
import ShareIcon from "../../icons/ShareIcon";
import { TryOnMode, useZakeke } from "@zakeke/zakeke-configurator-react";
import useStore from "../../Store";
import { QuestionDialog, useDialogManager } from '../dialogs/Dialogs';
import NftDialog, { NftForm } from '../dialogs/NftDialog'
import { T } from '../../Helpers';
import { AddToCartButton, Icon } from '../Atomic';
import useDropdown from '../../hooks/useDropdown';
import { TailSpin } from 'react-loader-spinner';
// import { PriceContainer } from '../Layout/LayoutStyles';
import styled from 'styled-components';
import footerBg from "../../assets/images/footer.svg"; // Import the image correctly
import { ReactComponent as SaveSolid } from '../../assets/icons/save-solid.svg';
import SaveDesignsDraftDialog from './SaveDesignsDraftDialog';

interface MenuFooterProps {
  viewFooter: any;
}

const PriceInfoTextContainer = styled.div`
	font-size: 14px;
`;

const MenuFooter: React.FC<MenuFooterProps> = ({ viewFooter }) => {
  const { showDialog, closeDialog } = useDialogManager();
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);
  const [disableButtonsByVisibleMessages, setDisableButtonsByVisibleMessages] = useState(false);
  const [openOutOfStockTooltip, closeOutOfStockTooltip,] = useDropdown();
  const { isAddToCartLoading, addToCart, price, useLegacyScreenshot, setQuantity, product, isMandatoryPD, quantity, nftSettings, eventMessages, isOutOfStock, visibleEventMessages, sellerSettings } = useZakeke();
  const { priceFormatter, pdValue, setIsPDStartedFromCart, isDraftEditor, isEditorMode, isViewerMode, tryOnRef, setTryOnMode } = useStore();
  const [quantityValue, setQuantityValue] = useState(
    product?.quantityRule && product.quantityRule?.minQuantity ? product.quantityRule.minQuantity : quantity
  );

  useEffect(() => {
    if (visibleEventMessages && visibleEventMessages.some((msg) => msg.addToCartDisabledIfVisible))
      setDisableButtonsByVisibleMessages(true);
    else setDisableButtonsByVisibleMessages(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleEventMessages]);


  const handleSaveClick = async () => {
    showDialog('save', <SaveDesignsDraftDialog onCloseClick={() => closeDialog('save')} />);
  };

  const handleAddToCart = () => {
    if (product?.quantityRule) setQuantity(quantityValue);
    // Check if the product has mandatory personalization data and the value is less than 1
    if (isMandatoryPD && pdValue < 1) {
      setIsPDStartedFromCart(true);
      tryOnRef?.current?.setVisible?.(true);
      tryOnRef?.current?.changeMode?.(TryOnMode.PDTool);
      setTryOnMode(TryOnMode.PDTool);
      return;
    }

    // Check if there is a cart message visible and show a confirmation dialog
    const cartMessage = eventMessages?.find((message) => message.eventID === 4);
    if (cartMessage && cartMessage.visible && !isDraftEditor && !isEditorMode)
      showDialog(
        'question',
        <QuestionDialog
          alignButtons='center'
          eventMessage={cartMessage?.description}
          buttonNoLabel={T._('Cancel', 'Composer')}
          buttonYesLabel={T._('Add to cart', 'Composer')}
          onYesClick={() => {
            // Check if NFT is enabled and show the NFT dialog
            if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
              showDialog(
                'nft',
                <NftDialog
                  nftTitle={T._(
                    "You're purchasing a customized product together with an NFT.",
                    'Composer'
                  )}
                  nftMessage={T._(
                    'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
                    'Composer'
                  )}
                  price={nftSettings.priceToAdd + price}
                  buttonNoLabel={T._('Skip and continue', 'Composer')}
                  buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
                  onYesClick={(nftForm: NftForm) => {
                    closeDialog('nft');
                    addToCart([], undefined, useLegacyScreenshot, nftForm);
                  }}
                  onNoClick={() => {
                    closeDialog('nft');
                    addToCart([], undefined, useLegacyScreenshot);
                  }}
                />
              );
            else addToCart([], undefined, useLegacyScreenshot);
            closeDialog('question');
          }}
        />
      );
    // If NFT is enabled, show the NFT dialog
    else if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
      showDialog(
        'nft',
        <NftDialog
          nftTitle={T._("You're purchasing a customized product together with an NFT.", 'Composer')}
          nftMessage={T._(
            'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
            'Composer'
          )}
          price={nftSettings.priceToAdd + price}
          buttonNoLabel={T._('Skip and continue', 'Composer')}
          buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
          onYesClick={(nftForm: NftForm) => {
            closeDialog('nft');
            addToCart([], undefined, useLegacyScreenshot, nftForm);
          }}
          onNoClick={() => {
            closeDialog('nft');
            addToCart([], undefined, useLegacyScreenshot);
          }}
        />
      );
    // Otherwise, add the product to the cart
    else {
      addToCart([], undefined, useLegacyScreenshot);
    }
  };

  const isBuyVisibleForQuoteRule = product?.quoteRule ? product.quoteRule.allowAddToCart : true;
  return (
    <div style={{
      background: 'white',
      padding: '20px 10px',
    }} className='footer_steps'>
      <div className="menu_footer" ref={viewFooter}>
        <div className="menu_actions">
          <div className="" style={{ display: 'flex', gap: '20px' }}>
            {/* <div className="sale_price">
              -20%
              <span className='off_price'>{T._d('Before')} : 0,80€/u</span>
            </div> */}
            <div className="price_value">
              {/* 0,80 € /un */}
              {priceFormatter.format(price)} /un
              <span className='price_value_total'>{T._d('Total')} : {priceFormatter.format(price)}</span></div>
          </div>

          <div className="add_cart">
            {/* {isBuyVisibleForQuoteRule && !isViewerMode && ( */}
            <AddToCartButton
              className="cart_button"
              ref={desktopButtonRef}
              onPointerEnter={() => {
                if (isOutOfStock)
                  openOutOfStockTooltip(desktopButtonRef.current!, 'top', 'top');
              }}
              onPointerLeave={() => {
                closeOutOfStockTooltip();
              }}
              disabled={disableButtonsByVisibleMessages || isAddToCartLoading || isOutOfStock}
              primary
              onClick={!isAddToCartLoading ? () => handleAddToCart() : () => null}
            >
              {isAddToCartLoading && <TailSpin color='#FFFFFF' height='25px' />}
              {!isAddToCartLoading && !isOutOfStock && (
                <span>
                  {isDraftEditor || isEditorMode
                    ? T._('Save', 'Composer')
                    : T._('Add to cart', 'Composer')}
                </span>
              )}
              {!isAddToCartLoading && isOutOfStock && <span>{T._('OUT OF STOCK', 'Composer')}</span>}
            </AddToCartButton>
            <h2>TEst</h2>
            {/* )}  */}
            {/* {!isDraftEditor &&
              !isEditorMode &&
              !isViewerMode &&
              sellerSettings &&
              sellerSettings.canSaveDraftComposition && ( */}
              <AddToCartButton key={'save'} onClick={() => handleSaveClick()}>
                  <Icon>
                    <SaveSolid />
                  </Icon>
                </AddToCartButton>
              {/* )} */}
          </div>

          {/* <div className="add_cart">
            {isAddToCartLoading ? (
              "Adding to cart..."
            ) : (
              <button
                onClick={() => addToCart([], undefined, useLegacyScreenshot)}
                className="cart_button"
              >
                añadir a carrito
              </button>
            )}
          </div> */}

          <div className="cart">
            {/* {isBuyVisibleForQuoteRule && !isViewerMode && ( */}
              <AddToCartButton
                className="cart_button"
                ref={mobileButtonRef}
                onPointerEnter={() => {
                  if (isOutOfStock)
                    openOutOfStockTooltip(mobileButtonRef.current!, 'top', 'top');
                }}
                onPointerLeave={() => {
                  closeOutOfStockTooltip();
                }}
                disabled={disableButtonsByVisibleMessages || isAddToCartLoading || isOutOfStock}
                primary
                onClick={!isAddToCartLoading ? () => handleAddToCart() : () => null}
              >
                {isAddToCartLoading && <TailSpin color='#FFFFFF' height='25px' />}
                {!isAddToCartLoading && !isOutOfStock && (
                  <span>
                    {isDraftEditor || isEditorMode
                      ? T._('Save', 'Composer')
                      : T._(' comprar', 'Composer')}
                  </span>
                )}
                {!isAddToCartLoading && isOutOfStock && <span>{T._('OUT OF STOCK', 'Composer')}</span>}
              </AddToCartButton>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFooter;
