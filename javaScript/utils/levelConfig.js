import ship1 from '../assets/icon/level/ship1.png';
import ship2 from '../assets/icon/level/ship2.png';
import ship3 from '../assets/icon/level/ship3.png';
import ship4 from '../assets/icon/level/ship4.png';
import ship5 from '../assets/icon/level/ship5.png';
import ship6 from '../assets/icon/level/ship6.png';
import ship7 from '../assets/icon/level/ship7.png';
import upgrade1 from '../lottie/upgrade1';
import upgrade2 from '../lottie/upgrade2';
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
const LevelConfiguration = [{
    ship: ship1,
    upgrade: upgrade1,
    lottie: 'upgrade1'
}, {
    ship: ship2,
    upgrade: upgrade2,
    lottie: 'upgrade2'
}];

export function getLevelConfig (level) {
    try {
        if (LevelConfiguration[level - 1]) {
            return LevelConfiguration[level - 1];
        } else {
            return LevelConfiguration[LevelConfiguration.length - 1];
        }
    } catch (e) {
        return LevelConfiguration[LevelConfiguration.length - 1];
    }
}

export const homeProLevelPosition = [[width * 0.06, 0], [width * 0.06, width * 0.15], [width * 0.17, width * 0.15], [width * 0.17, width * 0.03],
    [width * 0.29, width * 0.03], [width * 0.29, width * 0.15], [width * 0.39, width * 0.15], [width * 0.45, width * 0.01], [width * 0.52, width * 0.15],
    [width * 0.61, width * 0.15], [width * 0.68, width * 0.03], [width * 0.73, width * 0.12]];
