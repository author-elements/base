const AuthorElement = superClass => class extends superClass {
  constructor (templateString) {
    super()

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

    Object.defineProperties(this, {
      /**
       * @property PRIVATE
       * Storage Object for private methods and properties. Used internally.
       * @type {Object}
       * @private
       */
      PRIVATE: {
        value: {}
      },

      /**
       * @property UTIL
       * Storage Object for utility methods and properties.
       * @type {Object}
       * @private
       */
      UTIL: {
        value: {}
      }
    })

    Object.defineProperties(this.PRIVATE, {
      attributes: {
        value: {}
      },

      booleanAttributes: {
        value: {}
      },

      properties: {
        value: {}
      },

      privateProperties: {
        value: []
      },

      listeners: {
        value: []
      },

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

      getBooleanAttributeValue: {
        value: attr => this.hasAttribute(attr) && this.getAttribute(attr) !== 'false'
      },

      setBooleanAttributeValue: {
        value: (attr, value) => {
          if (typeof value === 'boolean') {
            value = value.toString()
          }

          let acceptableValues = ['true', 'false', '', null]

          if (!acceptableValues.includes(value)) {
            this.UTIL.printToConsole(`"${attr}" attribute expected boolean but received "${value}"`, 'error')
            return this.removeAttribute(attr)
          }

          switch (value) {
            case 'false':
            case null:
              return this.removeAttribute(attr)

            case 'true':
            case '':
              return this.setAttribute(attr, '')
          }
        }
      },
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

      defineAttributes: {
        value: attrs => {
          for (let attr in attrs) {
            this.UTIL.defineAttribute(attr, attrs[attr])
          }
        }
      },

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
            set: value => this.PRIVATE.properties[name] = value
          })
        }
      },

      defineProperties: {
        value: properties => {
          for (let property in properties) {
            this.UTIL.defineProperty(property, properties[property])
          }
        }
      },

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

      createEvent: {
        value: (name, detail) => {
          return new CustomEvent(name, { detail })
        }
      },

      /**
       * @method generateGuid
       * @param  {String} [prefix=null]
       * String to prepend to the beginning of the id.
       * @param  {String} [postfix=null]
       * String to append to the end of the id.
       * @return {String}
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
       * @param {Object} properties
       * @property {ErrorType} type
       * Type of error to throw. For example, 'reference' will throw a
       * new ReferenceError() instance, while 'type' will throw a new TypeError()
       * instance. Other values will throw customizable new Error() instances.
       * @property {Object} vars
       * Some error types have default messages which accept interpolated variables.
       * For example, 'dependency' errors accept an options 'name' variable, the
       * value of which should be the name of the missing dependency. They also
       * accept a 'url' variable, the value of which should be a url where the
       * dependency can be acquired.
       * @property {String} message
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
       * @param {String} message
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
       * @param {Function} callback
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
       * @param {String} evtName
       * Name of the event to listen to.
       * @param {Function} callback
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
  }

  attributeChangedCallback (attribute, oldValue, newValue) {
    this.emit('attribute.change', {
      attribute,
      oldValue,
      newValue
    })

    let { attributes, booleanAttributes } = this.PRIVATE

    if (attributes.hasOwnProperty(attribute)) {
      if (attributes[attribute] !== newValue) {
        this.PRIVATE.attributes[attribute] = newValue
      }

      return
    }

    if (booleanAttributes.hasOwnProperty(attribute)) {
      if (newValue !== 'true' && newValue !== '') {
        this.PRIVATE.booleanAttributes[attribute] = newValue
      }
    }
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

    setTimeout(() => {
      this.emit('rendered')
    }, 0)
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
   * @param  {String} name
   * Name of event to dispatch
   * @param  {Object} detail
   * Data object to include in the event's payload
   * @param  {DOMNode} [target=null]
   * DOM node to fire the event at.
   */
  emit (name, detail, target = null) {
    let event = this.UTIL.createEvent(name, detail)

    if (target) {
      return target.dispatchEvent(event)
    }

    this.dispatchEvent(event)
  }

  off (evtName, handler) {
    this.removeEventListener(evtName, handler)
  }

  /**
   * @method on
   * Convenience method. Attaches an event listener to the element.
   * @param  {String}   evtName
   * @param  {Function} handler
   * Called when the event is fired.
   */
  on (evtName, handler) {
    this.addEventListener(evtName, handler)
  }
}

export default AuthorElement
