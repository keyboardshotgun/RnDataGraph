import {Dimensions, StyleSheet} from 'react-native';
export const DEVICE_W = Dimensions.get('window').width;
export const DEVICE_H = Dimensions.get('window').height;
export const Box_Width = 0.33;
export const PostWidth = DEVICE_W * Box_Width;
export const WStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  car_container_top: {
    flex: 0.67,
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  car_container_bottom: {
    flex: 0.33,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  sub_container: {
    width: DEVICE_W * Box_Width,
    alignItems: 'center',
  },
  placeholder: {
    width: DEVICE_W * Box_Width,
  },
  box: {
    width: DEVICE_W * Box_Width,
    height: DEVICE_H * 0.2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  car_image: {
    width: '100%',
    height: '100%',
  },
});
