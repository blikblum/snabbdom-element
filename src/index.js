import { init } from 'snabbdom'
import vnode from 'snabbdom/vnode'
import { UpdatingElement } from 'lit-element/lib/updating-element.js'
export * from 'lit-element/lib/decorators.js'

export function initElementClass (modules) {
  const patch = init(modules)
  return class SnabbdomElement extends UpdatingElement {
    /**
    * Performs element initialization. By default this calls `createRenderRoot`
    * to create the element `renderRoot` node and captures any pre-set values for
    * registered properties.
    */
    initialize () {
      super.initialize()
      this.renderRoot = this.createRenderRoot()
    }

    /**
       * Returns the node into which the element should render and by default
       * creates and returns an open shadowRoot. Implement to customize where the
       * element's DOM is rendered. For example, to render into the element's
       * childNodes, return `this`.
       * @returns {Element|DocumentFragment} Returns a node into which to render.
       */
    createRenderRoot () {
      return this.attachShadow({ mode: 'open' })
    }

    /**
    * Updates the element. This method reflects property values to attributes
    * and calls `render` to render DOM via snabbdom. Setting properties inside
    * this method will *not* trigger another update.
    * * @param _changedProperties Map of changed properties with old values
    */
    update (changedProperties) {
      super.update(changedProperties)
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
    }

    disconnectedCallback () {
      super.disconnectedCallback()
      const emptyVTree = vnode(this.localName, {}, [], undefined, this.renderRoot)
      patch(this._vTree, emptyVTree)
    }

    /**
     * Invoked on each update to perform rendering tasks. This method must return
     * a snnabdom vnode. Setting properties inside this method will *not*
     * trigger the element to update.
     * @returns {vnode} Must return a snnabdom vnode.
     */
    render () { }
  }
}
