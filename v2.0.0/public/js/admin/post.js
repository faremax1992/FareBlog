$(document).ready(function () {

  // // list page
  // var ndCategory = $('.js-category:checked');
  // var ndKeyword = $('#js-keyword');

  // $('#js-category').on('click', function () {
  //   console.log('change');
  //   var query = queryString.parse(location.search);
  //   var category = ndCategory.val();
  //   var keyword = ndKeyword.val();

  //   if (category) {
  //     query.category = category
  //   } else {
  //     delete query.category;
  //   }

  //   if (keyword) {
  //     query.keyword = keyword
  //   } else {
  //     delete query.keyword;
  //   }

  //   console.log(queryString.stringify(query));
  //   window.location.url = window.location.origin + window.location.pathname + queryString.stringify(query);

  // });

  // add page
  if(typeof CKEDITOR !== 'undefined') {
    CKEDITOR.replace('js-post-content');
  }
});
