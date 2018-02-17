# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.1-beta3"></a>
## [1.1.1-beta3](https://github.com/NicolasThierion/synapse/compare/v1.1.1-beta2...v1.1.1-beta3) (2018-02-17)


### Bug Fixes

* **angular:** fixed angular's SynapseModule not being included ([91ab0ea](https://github.com/NicolasThierion/synapse/commit/91ab0ea))



<a name="1.1.1-beta2"></a>
## [1.1.1-beta2](https://github.com/NicolasThierion/synapse/compare/v1.1.1...v1.1.1-beta2) (2018-02-17)



<a name="1.0.0"></a>
# 1.0.0 (2018-01-21)


### Bug Fixes

* **endpoint:** created TypedResponse ([c3f86b9](https://gitlab.com/Pryum/synapse/commit/c3f86b9))
* **tests:** fixed CI tests ([a80cfec](https://gitlab.com/Pryum/synapse/commit/a80cfec))
* **typescript:** fixed bad typescript version in package.json ([ae696a1](https://gitlab.com/Pryum/synapse/commit/ae696a1))


### Features

* **@Body:** support for tx mapper ([560c83b](https://gitlab.com/Pryum/synapse/commit/560c83b))
* **@Body:** support urlEncoded body ([6bb0e26](https://gitlab.com/Pryum/synapse/commit/6bb0e26))
* **api:** ability to inherit parent @SynapseApi ([cf70917](https://gitlab.com/Pryum/synapse/commit/cf70917))
* **api:** path of inherited classes now appends to each other ([7ffc1c1](https://gitlab.com/Pryum/synapse/commit/7ffc1c1))
* **config:** exposes method.synapseConfig & class.synapseConfig ([5a18b49](https://gitlab.com/Pryum/synapse/commit/5a18b49))
* **core:** created core annotations ([5fb60ba](https://gitlab.com/Pryum/synapse/commit/5fb60ba))
* **endpoint:** added check for argument with missing decorators ([94ed7e0](https://gitlab.com/Pryum/synapse/commit/94ed7e0))
* **get:** added query parameters support. ([78d4f9a](https://gitlab.com/Pryum/synapse/commit/78d4f9a))
* **mapper:** support for deserializing json ([aa05975](https://gitlab.com/Pryum/synapse/commit/aa05975))
* **pathParams:** ability to replace path parameters. Reverted path appending in case of inheritance. Wrote tests ([0674555](https://gitlab.com/Pryum/synapse/commit/0674555))


### refacto

* **fetch:** refactored http-backend-adapter to be based on Fetch API ([d718046](https://gitlab.com/Pryum/synapse/commit/d718046))


### BREAKING CHANGES

* **fetch:** Usage of Promises, Request, Response, for better interop to standard Fetch API



<a name="0.2.0"></a>

# [0.2.0]() (2018-01-18)

### Features
- Synapse config is accessible at runtime form a SynapseApi or a SynapseMethod.

# [0.1.0]()
- added MIT license
