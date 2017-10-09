'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _s = require('underscore.string');
const mkdirp = require('mkdirp');
const themeV = '1.0.0';

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Yeoman source builder \n Welcome to the Drupal Source theme generator! \n For issue call the doctor'
    ));
    this.log(
      chalk.green(
        'With this you can create the scaffolding for your own Drupal theme.' + '\n' +
        'Developer info: \n' +
        'Dejan Dudukovic \n' +
        'mail: dexterns88@gmail.com \n' +
        'linkedin: https://www.linkedin.com/in/dexterns88 \n' +
        'github: https://github.com/dexterns88 \n' +
        'website: http://frontend-engineer.com \n'
      )
    );

    // define module list
    const moduleList = ['Slick', 'Singularity'];

    // Here, we add in extra prompts and settings from our base themes.
    const baseThemeList = [
      {name: 'No Base Theme', value: null},
      {name: 'stable (D8)', value: 'stable'},
      {name: 'classy (D8)', value: 'classy'},
      {name: 'garland (d7)', value: 'garland'},
      {name: 'bartik', value: 'bartik'},
      {name: 'engines', value: 'engines'},
      {name: 'seven', value: 'seven'},
      {name: 'stark', value: 'stark'}
    ];

    // List of drupal version
    const drupalVersionList = [
      {name: 'Drupal 8', value: 8},
      {name: 'Drupal 7', value: 7}
    ];

    const prompts = [
      {
        type: 'list',
        name: 'drupalV',
        message: 'Which Drupal version you want to use?',
        choices: drupalVersionList
      },
      {
        type: 'string',
        name: 'projectName',
        message: 'What\'s your theme\'s name?' + chalk.red(' (Required)'),
        validate: function (input) {
          if (input === '') {
            return 'Please enter your theme\'s name';
          }
          return true;
        },
        default: 'source'
      },
      {
        type: 'string',
        name: 'description',
        message: 'Project description',
        default: 'Source theme for Drupal'
      },
      {
        type: 'list',
        name: 'baseTheme',
        message: 'Which base theme you want to use?',
        choices: baseThemeList
      },
      {
        type: 'checkbox',
        name: 'moduleList',
        message: 'Which node module\'s you need to install?',
        choices: moduleList
      },
      {
        type: 'confirm',
        name: 'nodeInstall',
        message: 'Would you like to run npm install after theme setup?',
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;

      this.props.npm = [];
      this.props.npm.slick = props.moduleList.indexOf('Slick') > -1;
      this.props.npm.singularity = props.moduleList.indexOf('Singularity') > -1;
    });
  }

  default() {
    this.props.scss = 'source/scss';
    this.props.svgDir = 'source/svg';
    this.props.imgDir = 'source/images';
    this.props.jsDir = 'source/js';
    this.props.fontsDir = 'fonts';
    this.props.templateDir = 'templates';
    this.props.favIcoDir = 'fav';

    this.props.dConfig = 'config/install';
    this.props.projectSlug = _s.underscored(this.props.projectName);
    this.props.version = themeV;
  }

  writing() {
    // Create project name directory
    mkdirp.sync(this.props.projectSlug);

    // Set project name to be destination root folder
    this.destinationRoot(this.props.projectSlug);

    // Make all required directories what we will need.
    mkdirp.sync(this.props.scss);
    mkdirp.sync(this.props.jsDir);
    mkdirp.sync(this.props.fontsDir);
    mkdirp.sync(this.props.templateDir);
    mkdirp.sync(this.props.svgDir);
    mkdirp.sync(this.props.imgDir);
    mkdirp.sync(this.props.favIcoDir);

    if (this.props.drupalV === 8) {
      // Drupal 8 theme build
      mkdirp.sync(this.props.dConfig);

      // Config drupal install theme
      this.fs.copyTpl(
        this.templatePath('drupal8/config/install/_theme.settings.yml'),
        this.destinationPath(this.props.dConfig + '/' + this.props.projectSlug + '.settings.yml'),
        {props: this.props}
      );

      this.fs.copyTpl(
        this.templatePath('drupal8/_theme.info.yml'),
        this.destinationPath(this.props.projectSlug + '.info.yml'),
        {props: this.props}
      );

      this.fs.copy(
        this.templatePath('drupal8/_theme.libraries.yml'),
        this.destinationPath(this.props.projectSlug + '.libraries.yml')
      );

      this.fs.copy(
        this.templatePath('drupal8/_theme.layouts.yml'),
        this.destinationPath(this.props.projectSlug + '.layouts.yml')
      );

      this.fs.copyTpl(
        this.templatePath('drupal8/_theme.breakpoints.yml'),
        this.destinationPath(this.props.projectSlug + '.breakpoints.yml'),
        {props: this.props}
      );

      this.fs.copyTpl(
        this.templatePath('drupal8/_theme.theme'),
        this.destinationPath(this.props.projectSlug + '.theme'),
        {props: this.props}
      );

      this.fs.copy(
        this.templatePath('drupal8/tpl/html.html.twig'),
        this.destinationPath(this.props.templateDir + '/html.html.twig')
      );

      this.fs.copy(
        this.templatePath('drupal8/tpl/page.html.twig'),
        this.destinationPath(this.props.templateDir + '/page.html.twig')
      );

      this.fs.copy(
        this.templatePath('drupal8/tpl/ds_layouts/ds-offers/ds-offer.html.twig'),
        this.destinationPath(this.props.templateDir + '/ds_layouts/ds-offers/ds-offer.html.twig')
      );

      this.fs.copy(
        this.templatePath('drupal8/tpl/regions/region--content.html.twig'),
        this.destinationPath(this.props.templateDir + '/regions/region--content.html.twig')
      );

      this.fs.copy(
        this.templatePath('drupal8/tpl/regions/region--header.html.twig'),
        this.destinationPath(this.props.templateDir + '/regions/region--header.html.twig')
      );

      this.fs.copy(
        this.templatePath('drupal8/tpl/regions/region--sidebar-first.html.twig'),
        this.destinationPath(this.props.templateDir + '/regions/region--sidebar-first.html.twig')
      );

      this.fs.copy(
        this.templatePath('drupal8/tpl/regions/region--sidebar-second.html.twig'),
        this.destinationPath(this.props.templateDir + '/regions/region--sidebar-second.html.twig')
      );
    } else if (this.props.drupalV === 7) {
      // Drupal 7 theme build

      this.fs.copy(
        this.templatePath('drupal7/_template.php'),
        this.destinationPath('template.php')
      );

      this.fs.copyTpl(
        this.templatePath('drupal7/_theme.info'),
        this.destinationPath(this.props.projectSlug + '.info'),
        {props: this.props}
      );

      this.fs.copy(
        this.templatePath('drupal7/tpl/html.tpl.php'),
        this.destinationPath(this.props.templateDir + '/html.tpl.php')
      );

      this.fs.copy(
        this.templatePath('drupal7/tpl/page.tpl.php'),
        this.destinationPath(this.props.templateDir + '/page.tpl.php')
      );

      this.fs.copy(
        this.templatePath('drupal7/tpl/maintenance-page.tpl.php'),
        this.destinationPath(this.props.templateDir + '/maintenance-page.tpl.php')
      );
    }

    /*
    * General theme files.
    * */

    // Sample JavaScript file.
    this.fs.copy(
      this.templatePath('source/src/js/app.js'),
      this.destinationPath(this.props.jsDir + '/scripts.js')
    );

    // Install sass files
    this.fs.copy(
      this.templatePath('source/src/scss/_debug.scss'),
      this.destinationPath(this.props.scss + '/_debug.scss')
    );

    this.fs.copy(
      this.templatePath('source/src/scss/_mixins.scss'),
      this.destinationPath(this.props.scss + '/_mixins.scss')
    );

    this.fs.copy(
      this.templatePath('source/src/scss/_variables.scss'),
      this.destinationPath(this.props.scss + '/_variables.scss')
    );

    this.fs.copy(
      this.templatePath('source/src/scss/screen.scss'),
      this.destinationPath(this.props.scss + '/screen.scss')
    );

    // Gulp file build
    this.fs.copyTpl(
      this.templatePath('source/_gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      {props: this.props}
    );

    // Copy screenshots
    this.fs.copy(
      this.templatePath('source/screenshot.png'),
      this.destinationPath('screenshot.png')
    );

    // Some config files we want to have.
    this.fs.copy(
      this.templatePath('source/gitignore'),
      this.destinationPath('.gitignore')
    );

    // Package json for gulp
    this.fs.copyTpl(
      this.templatePath('source/_package.json'),
      this.destinationPath('package.json'),
      {props: this.props}
    );
  }

  install() {
    if (this.props.nodeInstall) {
      this.installDependencies({
        npm: this.props.nodeInstall,
        bower: false,
        yarn: false
      });
    }

    this.log(
      chalk.green(
        'Instalation finished. You can use theme now. \nCommand list:\n\nFor dev: gulp watch or gulp w \nFor production: gulp'
      )
    );
  }
};
