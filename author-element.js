const AuthorElement = superClass => class extends superClass {
  constructor (templateString) {
    super()

    Object.defineProperties(this, {
      /**
       * @property PRIVATE
       * Storage Object for private methods and properties. Used internally.
       * @type {object}
       */
      PRIVATE: {
        value: {}
      },

      /**
       * @property UTIL
       * Storage Object for utility methods and properties.
       * @type {object}
       */
      UTIL: {
        value: {}
      }
    })

    Object.defineProperties(this.PRIVATE, {
      /**
       * @property attributes
       * Used internally to manage registered attributes.
       * @private
       */
      attributes: {
        value: {}
      },

      /**
       * @property booleanAttributes
       * Used internally to manage registered boolean attributes.
       * @private
       */
      booleanAttributes: {
        value: {}
      },

      /**
       * @property properties
       * Used internally to manage registered properties.
       * @private
       */
      properties: {
        value: {}
      },

      /**
       * @property privateProperties
       * Used internally to manage registered private properties.
       * @private
       */
      privateProperties: {
        value: []
      },

      /**
       * @property listeners
       * Used internally to manage registered event listeners.
       * @private
       */
      listeners: {
        value: []
      },

      /**
       * @property initialize
       * Used internally to set up the element's Shadow Root and inject its template.
       * @private
       */
      initialize: {
        value: templateString => {
          this.keySource = 'key' in KeyboardEvent.prototype ? 'key' : ('keyIdentifier' in KeyboardEvent.prototype ? 'keyIdentifier' : 'keyCode')

          this.attachShadow({ mode: 'open' })

          let container = document.createElement('div')
          container.insertAdjacentHTML('afterbegin', templateString)

          let template = container.querySelector('template')

          if ('content' in template) {
            this.shadowRoot.appendChild(template.content.cloneNode(true))
          } else {
            template.childNodes.forEach((child) => {
              this.shadowRoot.appendChild(child.cloneNode(true))
            })
          }

          template = null
          this.crypto = null

          try {
            this.crypto = crypto
          } catch (e) {
            this.crypto = msCrypto
          }
        }
      },

      /**
       * @method definePrivateProperty
       * Used internally to register new private properties on the element
       * @param  {string} name
       * @param  {CustomPropertyObject} data
       * @private
       */
      definePrivateProperty: {
        value: (name, data) => {
          this.PRIVATE.privateProperties[name] = null

          Object.defineProperty(this.PRIVATE, name, {
            get: () => {
              if (this.PRIVATE.privateProperties[name] === null) {
                return data.default
              }

              return this.PRIVATE.privateProperties[name]
            },

            set: value => {
              if (data.readonly) {
                return this.throwError({
                  type: 'readonly',
                  vars: { prop: name }
                })
              }

              this.PRIVATE.privateProperties[name] = value
            }
          })
        }
      },

      /**
       * @method defineReadOnlyProperty
       * Used internally to register new readonly properties on the element.
       * @param  {string} name
       * @param  {CustomPropertyObject} data
       * @private
       */
      defineReadOnlyProperty: {
        value: (name, data) => {
          let cfg = {
            set: value => {
              this.throwError({
                type: 'readonly',
                vars: { prop: name }
              })
            },

            get: () => {
              if (data.hasOwnProperty('get')) {
                if (typeof data.get !== 'function') {
                  return this.UTIL.throwError({
                    type: 'type',
                    message: 'Property getter must be a function'
                  })
                }

                return data.get()
              }

              return data.hasOwnProperty('default') ? data.default : null
            }
          }

          Object.defineProperty(this, name, cfg)
        }
      },

      /**
       * @method getBooleanAttributeValue
       * Used internally. Returns a validated boolean attribute value.
       * @param  {string} name
       * @return {boolean}
       * @private
       */
      getBooleanAttributeValue: {
        value: name => this.hasAttribute(name) && this.getAttribute(name) !== 'false'
      },

      /**
       * @method setBooleanAttributeValue
       * Used internally. Ensures that a boolean attribute recieves a valid
       * boolean as a value.
       * @param  {string} name
       * @param  {any} value
       * @private
       */
      setBooleanAttributeValue: {
        value: (name, value) => {
          if (typeof value === 'boolean') {
            value = value.toString()
          }

          let acceptableValues = ['true', 'false', '', null]

          if (!acceptableValues.includes(value)) {
            this.UTIL.printToConsole(`"${name}" attribute expected boolean but received "${value}"`, 'error')
            return this.removeAttribute(name)
          }

          switch (value) {
            case 'false':
            case null:
              return this.removeAttribute(name)

            case 'true':
            case '':
              return this.setAttribute(name, '')
          }
        }
      }
    })

    Object.defineProperties(this.UTIL, {
      /**
       * @property childMonitor
       * The MutationObserver instance created upon calling this.UTIL.monitorChildren.
       * @type {MutationObserver}
       */
      childMonitor: {
        value: null
      },

      /**
       * @typedef {object} CustomAttributeObject shape: {
       *   get: {function} Custom getter
       *   set: {function} Custom setter
       *   default: {any} Default value
       * }
       */

      /**
       * @method defineAttribute
       * Registers a new attribute on the element and connects it to a new
       * property of the same name.
       * @param  {string} name
       * @param  {string|number|boolean|CustomAttributeObject} defaultValue
       * If a default value is passed, or if a CustomAttributeObject is passed
       * which includes a "default" property, getters will be applied that
       * return the default value if the actual value is null or undefined.
       */
      defineAttribute: {
        value: (name, defaultValue) => {
          let customGetter = null
          let customSetter = null

          if (typeof defaultValue === 'object') {
            let cfg = defaultValue

            if (cfg.hasOwnProperty('get')) {
              customGetter = cfg.get
            }

            if (cfg.hasOwnProperty('set')) {
              customSetter = cfg.set
            }

            defaultValue = cfg.hasOwnProperty('default') ? cfg.default : null
          }

          let isBool = typeof defaultValue === 'boolean'
          let privateKey = isBool ? 'booleanAttributes' : 'attributes'

          Object.defineProperty(this.PRIVATE[privateKey], name, {
            get: () => {
              if (customGetter) {
                let result = customGetter()
                return result === null ? defaultValue : result
              }

              return defaultValue
            },

            set: value => customSetter && customSetter(value)
          })

          Object.defineProperty(this, name, {
            get: () => {
              if (customGetter) {
                let result = customGetter()
                return result === null ? defaultValue : result
              }

              if (isBool) {
                return this.PRIVATE.getBooleanAttributeValue(name)
              }

              return this.hasAttribute(name) ? this.getAttribute(name) : defaultValue
            },

            set: value => {
              customSetter && customSetter(value)

              if (customGetter) {
                value = this.PRIVATE[privateKey][name]
              }

              if (isBool) {
                return this.PRIVATE.setBooleanAttributeValue(name, value)
              }

              this.setAttribute(name, value)
            }
          })
        }
      },

      /**
       * @method defineAttributes
       * Define multiple attributes at once.
       * @param  {object} attrs
       * Example:
       * {
       *   booleanAttr: false,
       *   stringAttr: 'string',
       *   customAttr: {
       *     get: () => this.customAttribute,
       *     default: 'defaultValue'
       *   }
       * }
       *
       * Custom attributes are configured as CustomAttributeObject
       */
      defineAttributes: {
        value: attrs => {
          for (let attr in attrs) {
            this.UTIL.defineAttribute(attr, attrs[attr])
          }
        }
      },

      /**
       * @typedef {object} CustomPropertyObject shape: {
       *   readonly: {boolean} optional
       *   private: {boolean} optional,
       *   default: {any} Default property value,
       *   get: {function} Custom Getter,
       *   set: {function} Custom setter
       * }
       */

      /**
       * @method defineProperty
       * Registers a custom property on the element. If an attribute of the same
       * name already exists, its paired property will be overwritten.
       * @param  {string} name
       * @param  {string|boolean|number|CustomPropertyObject} value
       */
      defineProperty: {
        value: (name, value) => {
          if (typeof value !== 'object') {
            this.PRIVATE.properties[name] = value
            this[name] = value
            return
          }

          let data = {
            readonly: value.hasOwnProperty('readonly') && value.readonly === true,
            private: value.hasOwnProperty('private') && value.private === true,
            default: value.hasOwnProperty('default') ? value.default : null
          }

          if (value.hasOwnProperty('get')) {
            if (typeof value.get !== 'function') {
              return this.UTIL.throwError({
                type: 'type',
                message: 'Property getter must be a function'
              })
            }

            data.get = value.get
          }

          if (value.hasOwnProperty('set')) {
            if (typeof value.set !== 'function') {
              return this.UTIL.throwError({
                type: 'type',
                message: 'Property setter must be a function'
              })
            }

            data.set = value.set
          }

          if (value.private) {
            return this.PRIVATE.definePrivateProperty(name, data)
          }

          if (value.readonly) {
            return this.PRIVATE.defineReadOnlyProperty(name, data)
          }

          this.PRIVATE.properties[name] = data.default

          Object.defineProperty(this, name, {
            get: () => this.PRIVATE.properties[name],
            set: value => { this.PRIVATE.properties[name] = value }
          })
        }
      },

      /**
       * @method defineProperties
       * Register multiple properties at once on the element.
       * @param  {object} properties
       * Example: {
       *   booleanProperty: false,
       *   stringProperty: 'string',
       *   customProperty: {
       *     readonly: true,
       *     private: true,
       *     get: () => {
       *       doSomething()
       *       return this.customProperty
       *     },
       *     default: 'default value'
       *   }
       * }
       */
      defineProperties: {
        value: properties => {
          for (let property in properties) {
            this.UTIL.defineProperty(property, properties[property])
          }
        }
      },

      /**
       * @method definePrivateMethods
       * Register multiple private methods on the element. These will be added
       * tp the element's "PRIVATE" object and can be accessed via this.PRIVATE.*
       * @param  {object} methods
       * Example {
       *   myPrivateMethod: () => doSomething()
       * }
       */
      definePrivateMethods: {
        value: methods => {
          for (let method in methods) {
            if (this.PRIVATE.hasOwnProperty(method)) {
              return this.UTIL.throwError({
                message: `Cannot create private method. Property name "${method}" is already in use.`
              })
            }

            this.PRIVATE[method] = methods[method]
          }
        }
      },

      /**
       * @method createEvent
       * Returns a new CustomEvent object.
       * @param  {[type]} name
       * Name of the event
       * @param  {object} detail
       * Properties to add to event.detail
       * @return {CustomEvent}
       */
      createEvent: {
        value: (name, detail) => {
          return new CustomEvent(name, { detail })
        }
      },

      /**
       * @method generateGuid
       * @param  {string} [prefix=null]
       * String to prepend to the beginning of the id.
       * @param  {string} [postfix=null]
       * String to append to the end of the id.
       * @return {string}
       * New RFC-compliant GUID
       */
      generateGuid: {
        value: (prefix = null, postfix = null) => {
          let id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => { // eslint-disable-line space-infix-ops
            return (c ^ this.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
          })

          if (prefix) {
            id = `${prefix}${id}`
          }

          if (postfix) {
            id = `${id}${postfix}`
          }

          return id
        }
      },

      /**
       * @typedef {string} ErrorType (custom, dependency, readonly, reference, type)
       * Indentifier for JavaScript built-in Error types including:
       * Error, TypeError, ReferenceError, or custom Error
       */

      /**
       * @method throwError
       * Throws a customizable new Error.
       * @param {object} properties
       * @property {ErrorType} type
       * Type of error to throw. For example, 'reference' will throw a
       * new ReferenceError() instance, while 'type' will throw a new TypeError()
       * instance. Other values will throw customizable new Error() instances.
       * @property {object} vars
       * Some error types have default messages which accept interpolated variables.
       * For example, 'dependency' errors accept an options 'name' variable, the
       * value of which should be the name of the missing dependency. They also
       * accept a 'url' variable, the value of which should be a url where the
       * dependency can be acquired.
       * @property {string} message
       * A custom message to append to the default error message.
       *
       * Example usage:
       * ```js
       * this.UTIL.throwError({
       *   type: 'dependency',
       *   vars: {
       *     name: 'NGN',
       *     url: 'https://github.com/ngnjs/NGN'
       *   },
       *   message: 'NGN makes development a breeze!'
       * })
       * ```
       */
      throwError: {
        value: properties => {
          let finalMessage = `<${this.localName}> `

          let type = properties.hasOwnProperty('type') ? properties.type : 'custom'
          let error = new Error()
          let { vars } = properties

          if (type === 'dependency') {
            finalMessage += 'Missing dependency'

            if (vars) {
              if (vars.hasOwnProperty('name')) {
                finalMessage += `: ${vars.name}`
              }

              if (vars.hasOwnProperty('url')) {
                finalMessage += ` ${vars.url}`
              }
            }
          } else if (type === 'readonly') {
            finalMessage += `Cannot set read-only property`

            if (vars && vars.hasOwnProperty('prop')) {
              finalMessage += ` "${vars.prop}"`
            }
          } else if (type === 'reference') {
            error = new ReferenceError()
          } else if (type === 'type') {
            error = new TypeError()
          } else {
            return this.UTIL.throwError({
              message: `Unrecognized error type "${type}". Accepted types: "custom", "dependency", "readonly", "reference", "type"`
            })
          }

          if (properties.hasOwnProperty('message')) {
            finalMessage += ` ${properties.message}`
          }

          error.message = finalMessage.trim()
          throw error
        }
      },

      /**
       * @typedef {string} ConsoleLogType (warning, error, info, log)
       * Indentifier for window.console built-in methods including:
       * warn(), error(), info(), log()
       */

      /**
       * @method printToConsole
       * Prints a message to the console, along with the tag-name of the element.
       * Can print customizable warnings, errors, info, or default logs.
       * @param {string} message
       * Message to print.
       * @param {ConsoleLogType} [type = 'log']
       * Type of message to print to the console. This will determine which
       * method of the window.console object is used to print the message.
       */
      printToConsole: {
        value: (message, type = 'log') => {
          let finalMessage = `<${this.localName}> ${message}`

          switch (type) {
            case 'warning': return console.warn(`[WARNING] ${finalMessage}`)
            case 'error': return console.error(`[ERROR] ${finalMessage}`)
            case 'info': return console.info(finalMessage)
            default: return console.log(finalMessage)
          }
        }
      },

      /**
       * @method monitorChildren
       * Applies a MutationObserver to the element.
       * @param {function} callback
       * Runs when a mutation occurs
       * @param {Boolean} [subtree = false]
       * Determines whether or not to observe changes to the descendants of the target node
       */
      monitorChildren: {
        value: (callback, subtree = false) => {
          this.childMonitor = new MutationObserver(callback)

          this.childMonitor.observe(this, {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: typeof subtree === 'boolean' ? subtree : false
          })
        }
      },

      /**
       * @method registerListener
       * Applies an event listener. This listener will be automatically cleaned up
       * upon element disconnect.
       * @param {DOMNode} element
       * Element to which to apply the event listener.
       * @param {string} evtName
       * Name of the event to listen to.
       * @param {function} callback
       * Function to call upon firing of the event.
       */
      registerListener: {
        value: (element, evtName, callback) => {
          let listener = {
            id: `listener_${this.UTIL.generateGuid()}`,
            apply: () => element.addEventListener(evtName, callback),
            remove: () => element.removeEventListener(evtName, callback)
          }

          this.PRIVATE.listeners.push(listener)
          listener.apply()
        }
      },

      /**
       * @method registerListeners
       * Applies multiple event listeners at once. Each listener will be automatically cleaned up
       * upon element disconnect.
       * @param {DOMNode} element
       * Element to which to apply all the event listeners.
       * @param {{name: String, callback: Function}[]} listeners
       * Event Listeners to apply.
       */
      registerListeners: {
        value: (element, listeners) => {
          for (let listener in listeners) {
            this.UTIL.registerListener(element, listener, listeners[listener])
          }
        }
      }
    })

    this.PRIVATE.initialize(templateString)
  }

  /**
   * @override
   * @method attributeChangedCallback
   * Synchronizes attribute/property updates.
   * @param  {string} attribute
   * @param  {string} oldValue
   * @param  {string} newValue
   * @fires attribute.change
   * Fires before change is applied to matching properties.
   * @fires attribute.changed
   * Fires after change has been applied to matching properties.
   */
  attributeChangedCallback (attribute, oldValue, newValue) {
    this.emit('attribute.change', {
      attribute,
      oldValue,
      newValue
    })

    let { attributes, booleanAttributes } = this.PRIVATE

    if (attributes.hasOwnProperty(attribute) && attributes[attribute] !== newValue) {
      this.PRIVATE.attributes[attribute] = newValue
    } else if (booleanAttributes.hasOwnProperty(attribute) && newValue !== 'true' && newValue !== '') {
      this.PRIVATE.booleanAttributes[attribute] = newValue
    }

    this.emit('attribute.changed', {
      attribute,
      oldValue,
      newValue
    })
  }

  /**
   * @override
   * @method connectedCallback
   * Fires events upon element connection.
   * @fires 'connected'
   * @fires 'rendered'
   * Fires once the element's children have been rendered to the DOM.
   */
  connectedCallback () {
    this.emit('connected')

    setTimeout(() => this.emit('rendered'), 0)
  }

  /**
   * @override
   * @method disconnectedCallback
   * Removes all registered event listeners upon element disconnect.
   * @fires 'disconnected'
   */
  disconnectedCallback () {
    this.PRIVATE.listeners.forEach(listener => listener.remove())
    this.emit('disconnected')
  }

  /**
   * @method emit
   * Dispatches a new CustomEvent()
   * @param  {string} name
   * Name of event to dispatch
   * @param  {object} detail
   * Data object to include in the event's payload
   * @param  {HTMLElement} [target=null]
   * DOM node to fire the event at.
   */
  emit (name, detail, target = null) {
    let event = this.UTIL.createEvent(name, detail)

    if (target) {
      return target.dispatchEvent(event)
    }

    this.dispatchEvent(event)
  }

  /**
   * @method off
   * Convenience method. Removes an event listener from the element.
   * @param  {string}   evtName
   * @param  {function} handler
   */
  off (evtName, handler) {
    this.removeEventListener(evtName, handler)
  }

  /**
   * @method on
   * Convenience method. Attaches an event listener to the element.
   * @param  {string}   evtName
   * @param  {function} handler
   * Called when the event is fired.
   */
  on (evtName, handler) {
    this.addEventListener(evtName, handler)
  }
}

export default AuthorElement
