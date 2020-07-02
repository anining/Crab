import ship1 from '../assets/icon/level/ship1.png';
import ship2 from '../assets/icon/level/ship2.png';
import ship3 from '../assets/icon/level/ship3.png';
import ship4 from '../assets/icon/level/ship4.png';
import ship5 from '../assets/icon/level/ship5.png';
import ship6 from '../assets/icon/level/ship6.png';
import ship7 from '../assets/icon/level/ship7.png';
import whole1 from '../lottie/whole1';
import whole2 from '../lottie/whole2';
import whole3 from '../lottie/whole3';
import whole4 from '../lottie/whole4';
import whole5 from '../lottie/whole5';
import whole6 from '../lottie/whole6';
import whole7 from '../lottie/whole7';
import upgrade2 from '../lottie/upgrade2';
import upgrade3 from '../lottie/upgrade3';
import upgrade4 from '../lottie/upgrade4';
import upgrade5 from '../lottie/upgrade5';
import upgrade6 from '../lottie/upgrade6';
import upgrade7 from '../lottie/upgrade7';
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
const LevelConfiguration = [{
    ship: ship1,
    upgrade: upgrade2,
    lottie: 'upgrade2',
    whole: whole1,
    wholeLottie: 'whole1',
}, {
    ship: ship2,
    upgrade: upgrade2,
    lottie: 'upgrade2',
    whole: whole2,
    wholeLottie: 'whole2',
}, {
    ship: ship3,
    upgrade: upgrade3,
    lottie: 'upgrade3',
    whole: whole3,
    wholeLottie: 'whole3',
}, {
    ship: ship4,
    upgrade: upgrade4,
    lottie: 'upgrade4',
    whole: whole4,
    wholeLottie: 'whole4',
}, {
    ship: ship5,
    upgrade: upgrade5,
    lottie: 'upgrade5',
    whole: whole5,
    wholeLottie: 'whole5',
}, {
    ship: ship6,
    upgrade: upgrade6,
    lottie: 'upgrade6',
    whole: whole6,
    wholeLottie: 'whole6',
}, {
    ship: ship7,
    upgrade: upgrade7,
    lottie: 'upgrade7',
    whole: whole7,
    wholeLottie: 'whole7',
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
export const avatarProLevelPosition = [[width * 0.06, 0], [width * 0.06, width * 0.15], [width * 0.06, width * 0.07], [width * 0.17, width * 0.15], [width * 0.12, width * 0.18], [width * 0.17, width * 0.03],
    [width * 0.17, width * 0.1], [width * 0.29, width * 0.03], [width * 0.22, width * 0.02], [width * 0.29, width * 0.15], [width * 0.29, width * 0.08], [width * 0.39, width * 0.15], [width * 0.34, width * 0.2], [width * 0.45, width * 0.01], [width * 0.41, width * 0.07], [width * 0.52, width * 0.15],
    [width * 0.5, width * 0.07], [width * 0.61, width * 0.15], [width * 0.57, width * 0.2], [width * 0.68, width * 0.03], [width * 0.63, width * 0.09], [width * 0.74, width * 0.08], [width * 0.74, width * 0.17]];
