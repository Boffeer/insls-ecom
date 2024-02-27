"use strict"

window.addEventListener('DOMContentLoaded', (event) => {
	const blogMasonryContainer = document.querySelector('.blog__masonry');
	if (blogMasonryContainer) {
	  let blogMasonry = new Masonry(blogMasonryContainer, {
	      // options...
	      itemSelector: '.blog-card',
	      gutter: 20,
	      columnWidth: '.blog-card',
	      percentPosition: true
	  });
	  blogMasonryContainer.classList.add('blog__masonry--init');
	  window.blogMasonry = blogMasonry
	  blogMasonry.layout();

	  let previousWidth = window.innerWidth;
	  window.addEventListener('resize', function() {
	    const currentWidth = window.innerWidth;
	    if (currentWidth === previousWidth) return;

	    blogMasonry.layout();
	    previousWidth = currentWidth;
	  });
	}
});