
/**
 * @fileoverview Custom functionality to apply throughout every adsize. This
 * has a dependency on common.js and utils.js
 */
var custom = (function() {

  /**
   * Classes which our JS hooks into. Add more class names as necessary.
   * @enum
   * @private
   */
  var elementClass_ = {
    item: 'js-item',
    itemName: 'js-item-name',
    itemPriceS: 'js-item-prices',
    itemPrice: 'js-item-price',
    itemSalePrice: 'js-item-saleprice',
    itemRegularPrice: 'js-item-regularprice',
    itemCta: 'js-item-cta',
    itemCover: 'js-cover'
  };
var elementId_ = {
        arrowPrevious: 'arrow-previous',
    arrowNext: 'arrow-next',
    gpaDataProvider: 'gpa-data-provider'
  };
  /**
   * Initialization. Called from handleAdInitialized on each page.
   */
  function init() {
    var data = common.getAdData();
    if (!data) return;

    // If you're using the swipe gallery to display feed items.
    initItemsUsingGallery_();

    // If you're NOT using the swipe gallery to display feed items.
    //initItemsWithoutGallery_();


  }

  function galleryFrameShown(event) {
    var gallery = common.getGallery();
    var itemsLength = gallery.frameCount;
    var indexFirst = common.getGalleryFrameIndexFirst(event);
    var indexLast = common.getGalleryFrameIndexLast(event);
    var arrowPrevious = utils.getElement(elementId_.arrowPrevious);
    var arrowNext = utils.getElement(elementId_.arrowNext);

    if (itemsLength < 2) {
      utils.showElement(arrowPrevious, false);
      utils.showElement(arrowNext, false);
      return;
    }
    if (indexFirst > 0) {
      arrowPrevious.style.visibility = 'visible';
    } else {
      arrowPrevious.style.visibility = 'hidden';
    }
    if (indexLast < itemsLength - 1) {
      arrowNext.style.visibility = 'visible';

    } else {
      arrowNext.style.visibility = 'hidden';
    }
  }


  /**
   * Find all items used in the swipe gallery and initialize custom behavior.
   * @private
   */
  function initItemsUsingGallery_() {
    var gallery = common.getGallery();

    // Apply settings to each item in the gallery
    var items = gallery.querySelectorAll('.' + elementClass_.item);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      initItemDisplay_(item);
    }
  }

  /**
   * Find all items used outside the gallery and initialize custom behavior.
   * @private
   */
  function initItemsWithoutGallery_() {
    // Apply settings to each item
    var items = document.querySelectorAll('.' + elementClass_.item);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      initItemDisplay_(item);
    }
  }

  /**
   * Set the display settings for each item.
   * Add any custom functionality you need applied on load.
   * @param {Element} item Item element.
   * @private
   */
  function initItemDisplay_(item) {

    // if you're using sales prices.
    setSalePricesDisplay_(item);

    // Set mouseout.
    itemMouseOut(item);
  }

  /**
   * Sets the 3 price elements to display correctly when using sales price.
   * Find your price elements and set into common functionality.
   * @param {Element} item Item element.
   * @private
   */
  function setSalePricesDisplay_(item) {
    // Get reference to each price element.
    var itemPrice = item.querySelector('.' + elementClass_.itemPrice);
    var itemSalePrice = item.querySelector('.' + elementClass_.itemSalePrice);
    var itemRegularPrice = item.querySelector('.' + elementClass_.itemRegularPrice);

    // Sets each item to display correct prices.
    common.displayCorrectPrices(itemPrice, itemSalePrice, itemRegularPrice);
  }

  /**
   * Custom Item Mouse Interactions. Add your own behavior.
   */

  /**
   * Custom Mouseover interaction functionality.
   * @param {Element} item
   */
  function itemMouseOver(item) {
    // Show Item CTA button:
    var cta = item.querySelector('.' + elementClass_.itemCta);
    if (cta) {
       var ctaOn = cta.children[1];
      if (ctaOn) utils.showElement(ctaOn, true);
    }
  }

  /**
   * Custom Mouseout interaction functionality.
   * @param {Element} item
   */
  function itemMouseOut(item) {
    // Hide Item CTA button:
    var cta = item.querySelector('.' + elementClass_.itemCta);
    if (cta) {
      var ctaOn = cta.children[1];
      if (ctaOn) utils.showElement(ctaOn, false);
    }
  }
  /*
  * Custom transform dynamic data for data validation.
  */
  function transformDynamicData () {
    var dataProvider = document.querySelector('#' + elementId_.gpaDataProvider);
    dataProvider.addDataTransformer(function(dynamicData) {

        var itemAttributes = ['name', 'subTitle', 'description'];

        /**
        * Convert Japanese fullspace to ASCII halfspace.
        */

        if(dynamicData.Product){
          for (var i = 0, l = dynamicData.Product.length; i < l; i++) {
            convertFullspaceToHalfspace(dynamicData.Product[i], itemAttributes);
            priceFormat(dynamicData.Product[i]);
            nameFromatXDF(dynamicData.Product[i]);
          }
        }
    });
  }

 function nameFromatXDF(product){
      if(!product.name) return;
      var indexNum = product.name.indexOf("_");
      if(indexNum < 0) return;
      else{
        // console.log(product.name.substring(0,indexNum))
         product.name =  product.name.substring(0,indexNum);
      }
   }

  function priceFormat (product) {
    if(!product.price) return;
    product.price = replaceChineseYenSign(product.price);
    product.price = removeCents(product.price);
  }

  /**
   * Replace double byte Chinese Yen sign (￥) to single byte Yen sign (¥).
   * @param {string} price Price attribute pottencially contains Yen sign.
   */
  function replaceChineseYenSign (price) {
    if(!price) return;

    if(price.indexOf("￥") != -1) {
      // Replacing Full Width Yen Sign (\uffe5) with Half Width Yen Sign (\u00a5).
      price = price.replace("\uffe5", "\u00a5");
    }

    return price;
  }

  /**
   * Remove cents where cents = '00'
   * @return {string} with cents removed
   */
  function removeCents (price) {
    if(! price) return;
    var matcher = /(\.|\,)0{2}(?![\d])/;
    return price.replace(matcher, '');
  }

  /**
   * Convert fullspace to ASCII halfspace.
   * @param {Object} item Item whose attributes are checked.
   * @param {Array} attrs Item attributes to check.
   */
  function convertFullspaceToHalfspace (item, attrs) {
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if(item[attrs[i]]) {
        item[attr] = convert(item[attr]);
      }
    }

    function convert (text) {
      if(text && text.indexOf("　") != -1) {
        text = text.replace(/　/g," ");
      }
      return text;
    }
  }

  function itemCover(){
    var items = document.querySelectorAll('.' + elementClass_.item);

    for(var i=0;i<items.length;i++){
      var item = items[i];
      var cover = item.querySelectorAll('.' + elementClass_.itemCover)[0];

      if(i == common.getCurrentItemIndex()){
        cover.style.display = "none";
      }else cover.style.display = "block";
    }
  }

  function getDataCount() {
    return totalCount;
  }
  return {
    init: init,
    galleryFrameShown: galleryFrameShown,
    itemMouseOver: itemMouseOver,
    itemMouseOut: itemMouseOut,
    itemCover: itemCover,
    transformDynamicData: transformDynamicData
  };

})();
