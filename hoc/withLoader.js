import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { map, isObject, isFunction, zipObject } from 'lodash';

export default function (AsyncComponent, options) {
    return class extends PureComponent {
        constructor() {
            super();

            this.state = {
                loading: true,
                asyncRequestsFailed: false,
                error: null
            };
        }


        componentDidMount() {
            const functionNames = [];

            if (isObject(options.asyncRequests)) {
                // Build an array of promises by iterate all functions of `asyncRequests`.
                const asyncRequests = map(options.asyncRequests, (asyncRequest) => {
                    if (isFunction(asyncRequest)) {
                        const promise = asyncRequest(this.props);

                        if (promise instanceof Promise) {
                            functionNames.push(asyncRequest.name);
                            return promise;
                        }
                    }
                });

                // Load all information requested
                Promise.all(asyncRequests)
                    .then((results) => {
                        this.setState({
                            loading: false,
                            // Lets assume that results are originated form 3 functions which return 3 promises
                            // and the functions names are: xpto, x, z.
                            // results = [ { ... }, { ... }, { ... } ]
                            // the zipObject will create a object with the following structure.
                            // {
                            //     "xpto":    { ... },
                            //     "x":   { ... },
                            //     "z": { ... }
                            // }
                            asyncResults: zipObject(functionNames, results)
                        });
                    })
                    .catch((e) => {
                        this.setState({
                            loading: false,
                            asyncRequestsFailed: true,
                            error: e
                        }, () => {
                            if (isFunction(options.onError)) {
                                options.onError(this.props);
                            }
                        });
                    });
            }
        }

        render() {
            if (this.state.loading) {
                const props = isObject(options.loaderProps) ? options.loaderProps : {};
                return (
                    <Text>
                        loader
                    </Text>
                );
            } else if (this.state.asyncRequestsFailed) {
                const errorConfiguration = {
                    errorType: isObject(options.errorPage) ? options.errorPage.errorType : this.state.error.message,
                    message: isObject(options.errorPage)
                        ? options.errorPage.message
                        : `Cannot connect to ${this.state.error}`,
                    icon: isObject(options.errorPage) ? options.errorPage.icon : null,
                    button: isObject(options.errorPage) ? options.errorPage.button : null
                };

                return React.isValidElement(options.onErrorComponent)
                    ? options.onErrorComponent
                    : (
                        <Text> : (</Text>
                    );
            }

            return <AsyncComponent {...this.state.asyncResults} {...this.props} />;
        }
    };
}
