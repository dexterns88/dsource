/**
 * Created by dexter on 7/12/16.
 * This is theme script
 * You can write your own code under drupal behavior, or call existing plugins
 */

(function($) {
  'use strict';

  // Remove this script after install
  // This is only example script
  Drupal.behaviors.sampleD8Starter = {
    attach: function (context, settings) {

      $('body', context).once('sampleD8Starter').each(function(){
        alert("It's working, remove sample from file in source/js/app.js");
      });
    }
  };

})(jQuery);