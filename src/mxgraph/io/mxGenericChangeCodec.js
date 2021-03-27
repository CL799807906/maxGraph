/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 */

import mxObjectCodec from './mxObjectCodec';
import mxValueChange from '../model/atomic_changes/mxValueChange';
import mxStyleChange from '../model/atomic_changes/mxStyleChange';
import mxGeometryChange from '../model/atomic_changes/mxGeometryChange';
import mxCollapseChange from '../model/atomic_changes/mxCollapseChange';
import mxVisibleChange from '../model/atomic_changes/mxVisibleChange';
import mxCellAttributeChange from '../model/atomic_changes/mxCellAttributeChange';
import mxCodecRegistry from './mxCodecRegistry';
import mxUtils from "../util/mxUtils";

class mxGenericChangeCodec extends mxObjectCodec {
  /**
   * Class: mxGenericChangeCodec
   *
   * Codec for <mxValueChange>s, <mxStyleChange>s, <mxGeometryChange>s,
   * <mxCollapseChange>s and <mxVisibleChange>s. This class is created
   * and registered dynamically at load time and used implicitly
   * via <mxCodec> and the <mxCodecRegistry>.
   *
   * Transient Fields:
   *
   * - model
   * - previous
   *
   * Reference Fields:
   *
   * - cell
   *
   * Constructor: mxGenericChangeCodec
   *
   * Factory function that creates a <mxObjectCodec> for
   * the specified change and fieldname.
   *
   * Parameters:
   *
   * obj - An instance of the change object.
   * variable - The fieldname for the change data.
   */
  constructor(obj, variable) {
    super(obj, ['model', 'previous'], ['cell']);
    this.variable = variable;
  }

  /**
   * Function: afterDecode
   *
   * Restores the state by assigning the previous value.
   */
  afterDecode(dec, node, obj) {
    // Allows forward references in sessions. This is a workaround
    // for the sequence of edits in mxGraph.moveCells and cellsAdded.
    if (mxUtils.isNode(obj.cell)) {
      obj.cell = dec.decodeCell(obj.cell, false);
    }

    obj.previous = obj[this.variable];
    return obj;
  }
}

// Registers the codecs
mxCodecRegistry.register(new mxGenericChangeCodec(new mxValueChange(), 'value'));
mxCodecRegistry.register(new mxGenericChangeCodec(new mxStyleChange(), 'style'));
mxCodecRegistry.register(
  new mxGenericChangeCodec(new mxGeometryChange(), 'geometry')
);
mxCodecRegistry.register(
  new mxGenericChangeCodec(new mxCollapseChange(), 'collapsed')
);
mxCodecRegistry.register(
  new mxGenericChangeCodec(new mxVisibleChange(), 'visible')
);
mxCodecRegistry.register(
  new mxGenericChangeCodec(new mxCellAttributeChange(), 'value')
);

export default mxGenericChangeCodec;
