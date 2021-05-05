// This is the important part!

export function collapse(element, parent = null) {
  if (!parent) {
    parent = element;
  }
  // get the height of the element's inner content, regardless of its actual size
  let sectionHeight = element.scrollHeight;

  // temporarily disable all css transitions
  let elementTransition = element.style.transition;
  element.style.transition = '';

  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(function () {
    element.style.height = `${sectionHeight}px`;
    element.style.transition = elementTransition;

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(function () {
      element.style.height = `${0}px`;
    });
  });

  // mark the section as "currently collapsed"
  parent.setAttribute('data-collapsed', 'true');
}

export function expand(element, parent = null) {
  if (!parent) {
    parent = element;
  }
  // get the height of the element's inner content, regardless of its actual size
  let sectionHeight = element.scrollHeight;

  // have the element transition to the height of its inner content
  element.style.height = `${sectionHeight}px`;

  // when the next css transition finishes (which should be the one we just triggered)
  element.addEventListener('transitionend', function () {
    // remove this event listener so it only gets triggered once
    element.removeEventListener('transitionend', arguments.callee);

    // remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = null;
  });

  // mark the section as "currently not collapsed"
  parent.setAttribute('data-collapsed', 'false');
}

export function toggle(selector = '.toggle') {
  // Setup
  document.querySelectorAll('.collapsible').forEach((contentEl) => {
    if (!contentEl.hasAttribute('data-collapsed')) {
      contentEl.setAttribute('data-collapsed', true);
      contentEl.querySelector('.collapsible__content').style.height = '0px';
    }
  });

  // Event: click
  if (document.querySelector(selector)) {
    document.querySelector(selector).addEventListener('click', function (e) {
      e.preventDefault();
      let button = e.currentTarget;
      let section = button.closest('.collapsible');
      let content = section.classList.contains('collapsible__content')
        ? section
        : section.querySelector('.collapsible__content');
      let isCollapsed = section.getAttribute('data-collapsed') === 'true';

      if (isCollapsed) {
        expand(content, section);
        section.setAttribute('data-collapsed', 'false');
      } else {
        collapse(content, section);
      }
    });
  }
}
