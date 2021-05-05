//
// Preview lib
//
class Preview {
  /**
   * Class constructor
   *
   * @return void
   */
  constructor() {
    this.selector = $('.preview');
  }

  /**
   * Init
   *
   * @return mixed
   */
  init() {
    this.selector.each((index, element) => {
      this.prepare(element);
      this.nav(element);
    });
    return this;
  }

  /**
   * Prepare
   *
   * @return mixed
   */
  prepare(element) {
    // Active first item
    $('.preview__item:first-child', element).attr('data-state', 'active');
    $('.preview__nav__item:first-child', element).attr('data-state', 'active');

    // Add index
    $('.preview__item', element).each((index, el) => {
      $(el).attr('data-index', index + 1);
    });
    $('.preview__nav__item', element).each((index, el) => {
      $(el).attr('data-index', index + 1);
    });
  }

  /**
   * Nav
   *
   * @return mixed
   */
  nav(element) {
    $('.preview__nav button', element).click((evt) => {
      evt.preventDefault();
      const button = $(evt.currentTarget);
      const item = button.parents('.preview__nav__item');
      const index = item.attr('data-index');
      const previewItem = $(`.preview__item[data-index="${index}"]`, element);

      if (previewItem.length > 0) {
        // Hide active
        $('.preview__item[data-state="active"]', element).removeAttr(
          'data-state',
        );
        $('.preview__nav__item[data-state="active"]', element).removeAttr(
          'data-state',
        );
        // Show active
        item.attr('data-state', 'active');
        previewItem.attr('data-state', 'active');
      }
    });
  }
}

export default Preview;
