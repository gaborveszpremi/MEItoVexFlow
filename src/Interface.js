/*
 * MEItoVexFlow, Interface class
 *
 * Author: Alexander Erhard
 *
 * Copyright © 2014 Richard Lewis, Raffaele Viglianti, Zoltan Komives,
 * University of Maryland
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
define([
  'vexflow',
  'm2v/vexflow-overrides',
  'meilib/MeiLib',
  'm2v/core/Logger',
  'm2v/core/Converter',
], function (VF, overrides, MeiLib, Logger, Converter, undefined) {
  window.MeiLib = MeiLib;


  window.MEI2VF = {
    /**
     * @method setLogging sets logging behavior
     * @param {String|Boolean} level If true is passed, all logging is enabled, if false, no logging will occur. The logger is off by default.
     * The following string values set logging up to the specified level:
     *
     * - true|'debug' debug messages
     * - 'info' info, e.g. unsupported elements
     * - 'warn' warnings, e.g. wrong encodings
     * - 'error' errors
     * - false no logging
     */
    setLogging : Logger.setLevel,
    /**
     * The methods in Converter can be used to manually address distinct
     * processing steps and retrieve the created data. Can be used in
     * addition or as a supplement to {@link render_notation} and
     * {@link rendered_measures}
     */
    Converter : {
      /**
       * initializes the converter
       * @method initConfig
       * @param {Object} config The options passed to the converter. For a list, see
       * {@link MEI2VF.Converter#defaults}
       */
      initConfig : function (config) {
        Converter.prototype.initConfig(config);
      },
      /**
       * Processes the specified MEI document or document fragment. The generated
       * objects can be processed further or drawn immediately to a canvas via
       * {@link #draw}.
       * @method process
       * @param {XMLDocument} xmlDoc the XML document
       */
      process : function (xmlDoc) {
        Converter.prototype.process(xmlDoc);
      },
      /**
       * Draws the processed data to a canvas
       * @method draw
       * @param ctx The canvas context
       */
      draw : function (ctx) {
        Converter.prototype.draw(ctx);
      },
      /**
       * returns a 2d array of all Vex.Flow.Stave objects, arranged by
       * [measure_n][staff_n]
       * @method getAllVexMeasureStaffs
       * @return {Vex.Flow.Stave[][]} see {@link MEI2VF.Converter#allVexMeasureStaffs}
       */
      getAllVexMeasureStaffs : function () {
        Converter.prototype.getAllVexMeasureStaffs();
      },
      /**
       * Returns the width and the height of the area that contains all drawn
       * staves as per the last processing.
       *
       * @method getStaffArea
       * @return {Object} the width and height of the area that contains all staves.
       * Properties: width, height
       */
      getStaffArea : function () {
        return Converter.prototype.getStaffArea();
      }
    },
    /**
     * Contains all Vex.Flow.Stave objects created when calling {@link #render_notation}.
     * Addressing scheme: [measure_n][staff_n]
     * @property {Vex.Flow.Stave[][]} rendered_measures
     */
    rendered_measures : null,
    /**
     * Main rendering function.
     * @param {XMLDocument} xmlDoc The MEI XML Document
     * @param {Element} target An svg or canvas element
     * @param {Number} width The width of the print space in pixels. Defaults to 800 (optional)
     * @param {Number} height The height of the print space in pixels. Defaults to 350 (optional)
     * @param {Number} backend Set to Vex.Flow.Renderer.Backends.RAPHAEL to
     * render to a Raphael context; if falsy, Vex.Flow.Renderer.Backends.CANVAS
     * is set
     * @param {Object} options The options passed to the converter. For a list, see
     * {@link MEI2VF.Converter MEI2VF.Converter}
     */
    render_notation : function (xmlDoc, target, width, height, backend, options) {
      var ctx;
      var cfg = options || {};

      ctx = new VF.Renderer(target, backend || VF.Renderer.Backends.CANVAS).getContext();

      width = width || 800;
      height = height || 350;

      if (+backend === VF.Renderer.Backends.RAPHAEL) {
        ctx.paper.setSize(width, height);
      }

      cfg.pageWidth = width;

      this.Converter.initConfig(cfg);
      this.Converter.process(xmlDoc[0] || xmlDoc);
      this.Converter.draw(ctx);
      this.rendered_measures = this.Converter.getAllVexMeasureStaffs();

    }
  };

});