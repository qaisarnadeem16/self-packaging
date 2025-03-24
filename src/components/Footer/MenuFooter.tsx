import React from 'react';
import ShareIcon from "../../icons/ShareIcon";
import { useZakeke } from "@zakeke/zakeke-configurator-react";
import useStore from "../../Store";
import footerBg from "../../assets/images/footer.svg"; // Import the image correctly

interface MenuFooterProps {
  viewFooter: any;
}

const MenuFooter: React.FC<MenuFooterProps> = ({ viewFooter }) => {
  const { isAddToCartLoading, addToCart, price, useLegacyScreenshot } = useZakeke();
  const { priceFormatter } = useStore();

  return (
    <div style={{
      backgroundImage: `url(${footerBg})`,}} className='footer_steps'>
      <div className="menu_footer" ref={viewFooter}>
        <div className="menu_actions">
          <div className="price_value">{priceFormatter.format(price)}</div>

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
        </div>
      </div>
    </div>
  );
};

export default MenuFooter;
