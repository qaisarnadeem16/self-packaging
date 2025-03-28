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
      backgroundImage: `url(${footerBg})`,
    }} className='footer_steps'>
      <div className="menu_footer" ref={viewFooter}>
        <div className="menu_actions">
          <div className="" style={{display:'flex', gap:'20px'}}>
            <div className="sale_price">
              -20%
              <span className='off_price'>Antes: 0,80€/u</span>
            </div>
            <div className="price_value">{priceFormatter.format(price)} <span className='price_value_total'>TOTAL: 0.00 €</span></div>
          </div>

          <div className="add_cart">
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

          <div className="">
            {isAddToCartLoading ? (
              "Adding to cart..."
            ) : (
              <button
                onClick={() => addToCart([], undefined, useLegacyScreenshot)}
                className="cart"
              >
                comprar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFooter;
