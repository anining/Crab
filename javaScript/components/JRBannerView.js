import { requireNativeComponent, View } from 'react-native';
import PropTypes from 'prop-types';

const iface = {
    name: 'jrbanner',
    propTypes: {
        ...View.propTypes, // 包含默认的View的属性，如果没有这句会报‘"..." has no propType for native prop "..." of native type "..."’错误
    },
};

module.exports = requireNativeComponent('jrbanner', iface);
