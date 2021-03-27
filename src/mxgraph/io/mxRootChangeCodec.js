/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 */

import mxRootChange from '../model/atomic_changes/mxRootChange';
import mxCodecRegistry from './mxCodecRegistry';
import mxConstants from "../util/mxConstants";
import mxObjectCodec from "./mxObjectCodec";

class mxRootChangeCodec extends mxObjectCodec {
  /**
   * Class: mxRootChangeCodec
   *
   * Codec for <mxRootChange>s. This class is created and registered
   * dynamically at load time and used implicitly via <mxCodec> and
   * the <mxCodecRegistry>.
   *
   * Transient Fields:
   *
   * - model
   * - previous
   * - root
   */
  constructor() {
    super(new mxRootChange(), ['model', 'previous', 'root']);
  }

  /**
   * Function: onEncode
   *
   * Encodes the child recursively.
   */
  afterEncode(enc, obj, node) {
    enc.encodeCell(obj.root, node);

    return node;
  }

  /**
   * Function: beforeDecode
   *
   * Decodes the optional children as cells
   * using the respective decoder.
   */
  beforeDecode(dec, node, obj) {
    if (
      node.firstChild != null &&
      node.firstChild.nodeType === mxConstants.NODETYPE_ELEMENT
    ) {
      // Makes sure the original node isn't modified
      node = node.cloneNode(true);

      let tmp = node.firstChild;
      obj.root = dec.decodeCell(tmp, false);

      let tmp2 = tmp.nextSibling;
      tmp.parentNode.removeChild(tmp);
      tmp = tmp2;

      while (tmp != null) {
        tmp2 = tmp.nextSibling;
        dec.decodeCell(tmp);
        tmp.parentNode.removeChild(tmp);
        tmp = tmp2;
      }
    }

    return node;
  }

  /**
   * Function: afterDecode
   *
   * Restores the state by assigning the previous value.
   */
  afterDecode(dec, node, obj) {
    obj.previous = obj.root;

    return obj;
  }
}

mxCodecRegistry.register(new mxRootChangeCodec());
export default mxRootChangeCodec;
