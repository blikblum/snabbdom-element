import { UpdatingElement } from '@polymer/lit-element/lib/updating-element'
import { init } from 'snabbdom'
import vnode from 'snabbdom/vnode'

export function initElementClass (modules) {
  const patch = init(modules)
  return class SnabbdomElement extends UpdatingElement {
    /**
    * Updates the element. This method reflects property values to attributes
    * and calls `render` to render DOM via lit-html. Setting properties inside
    * this method will *not* trigger another update.
    * * @param _changedProperties Map of changed properties with old values
    */
    update (changedProperties) {
      super.update(changedProperties)
      if (typeof this.render === 'function') {
        let newVTree = this.render()
        newVTree = vnode(
          this.localName,
          {},
          Array.isArray(newVTree) ? newVTree : [newVTree],
          undefined,
          this.renderRoot
        )
        if (!this._vTree) {
          // small cheat to allow rendering root el
          // creates an empty vnode with the same sel as the rendered vtree
          // this ensure the view element will be properly patched
          const emptyVTree = vnode(this.localName, {}, [], undefined, this.renderRoot)
          patch(emptyVTree, newVTree)
        } else {
          patch(this._vTree, newVTree)
        }
        this._vTree = newVTree
      } else {
        throw new Error('render() not implemented')
      }
    }

    disconnectedCallback () {
      super.disconnectedCallback()
      const emptyVTree = vnode(this.localName, {}, [], undefined, this.renderRoot)
      patch(this._vTree, emptyVTree)
    }
  }
}
