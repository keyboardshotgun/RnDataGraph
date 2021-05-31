//import SQLite, {SQLiteDatabase} from "react-native-sqlite-storage";
import {Alert} from "react-native";

export const ChartColors = [  "#9400D3", "#4B0082", "#0000FF", "#00FF00", "#00f0ff"
  , "#FF7F00", "#FF0000", "#55069f", "#850d19", "#d0f66a"
  , "#3ca6bf", "#a95099", "#65a59a", "#6af5d0", "#576492"
  , "#d47a2a", "#2c6b2c", "#9b6fc1", "#97d997", "#d08767"];

export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
        new Promise(resolve => {
            if (timeout) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(() => resolve(func(...args)), waitFor)
        });
};

export const idMaker = (len: number | undefined = 8): string => {
    let str: string = "";
    for (let i = 0; i < len; i++) {
        let rand = Math.floor(Math.random() * 62);
        let charCode = rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48;
        str += String.fromCharCode(charCode);
    }
    return str;
};

export const rangeMaker = (size: number, startNumber: number = 0): readonly number[] => {
    return [...Array(size).keys()].map(i => i + startNumber);
};

export const alertMaker = (alertTitle: string, text: string) => {
    Alert.alert(
      alertTitle,
      text,
      [
          { text: '확인', onPress : () => false , style: 'cancel'}
      ]
      ,{cancelable: false}
    );
};

export const getMinMax = <T extends Record<U, any> ,U extends keyof T>(type: "MIN" | "MAX" , arr: T[], key : U) : number => {
  const results : number[] = [];
  if(arr && arr.length > 0 && key in arr[0])
  {
    arr.map( (el,_) => {
      return results.push(el[key]);
    });
  };

  if(type === "MIN"){
    return Math.min(...results);
  }else if(type === "MAX"){
    return Math.max(...results);
  }else{
    return -1.9191919191919;
  }
};


export const sumOfObjectBykey = <T extends Record<U, any> ,U extends keyof T>(arr: T[], key : U) : number => {
  let sum :number = 0;
  arr.map((el,index) => {
    if(el[key] && el[key] > 0)
    {
      return sum += el[key] * 1;
    }
  })
  return sum;
};

// For Sqlite ===================================================================
// SQLite.enablePromise(true);
// SQLite.DEBUG(false);
// let dbObj: SQLite.SQLiteDatabase;

// export const connDB = async () => {
//     try {
//         await SQLite.openDatabase({
//             name: 'daysmemo',
//             location: 'default',
//             createFromLocation: "~www/weatherMemo.db"
//         })
//             .then((DB: SQLiteDatabase) => {
//                 console.log('[connDB] success opening DB');
//                 dbObj = DB;
//             })
//             .catch((err) => {
//                 console.log('[connDB] error opening DB =>', err);
//             });
//     } catch (err) {
//         console.log('connDB err =>', err);
//     }
// };

// export const disConnDB = async () => {
//     if (dbObj) await dbObj?.close().then(() => console.log('db close success')).catch((err) => console.log('db close err', err));
// }


// type sendQueryType = 'POST' | 'PUT' | 'GET' | 'GET_MONTHLY' | 'DELETE' | 'DELETE_ALL';
//
// export async function sendQuery(type: sendQueryType
//     , targetDay?: string
//     , inputText?: string
//     , today_weather?: todayWeatherType): Promise<string | memosType[] | void> {
//
//     let prefix = "";
//     let failMsg = "";
//     let successMsg = "";
//     let alertTitle = "알림";
//     let today = targetDay || dayInfo('DATE');
//     let keycode = today.split('-', 2).join('-');
//     let weather = today_weather?.index.split(':')[1] || 1;
//     let params: any[] = [];
//
//     switch (type) {
//         case 'POST':
//         case 'PUT' :
//             alertTitle = "저장 / 수정";
//             let msg = inputText;
//             if (msg && msg.length > 0) {
//                 if (type === 'POST') {
//                     //prefix = "SELECT * from daysmemo";
//                     prefix = "INSERT INTO daysmemo (keycode, memo , weatherinfo , created) VALUES (?, ?, ?, ? )"
//                     params = [keycode.toString(), msg.toString(), weather.toString(), today];
//                 } else {
//                     prefix = "UPDATE daysmemo SET memo= ? WHERE created = ? ";
//                     params = [msg.toString(), today];
//                 }
//                 successMsg = today + "일 메모를 기록 했습니다.";
//                 failMsg = today + " 일 메모 기록 실패.";
//             } else {
//                 return alert('메모에 문제가 있습니다\n' + JSON.stringify(msg));
//             }
//             break;
//         case 'GET':
//             prefix = "SELECT * FROM daysmemo WHERE created = ? ";
//             successMsg = today + " 메모 로드성공";
//             failMsg = today + " 메모 로드실패";
//             params = [today];
//             break;
//         case 'GET_MONTHLY':
//             prefix = "SELECT * FROM daysmemo WHERE keycode = ? ";
//             successMsg = keycode + "월 로드성공";
//             failMsg = keycode + "월 로드실패";
//             params = [keycode];
//             break;
//         case 'DELETE_ALL':
//             alertTitle = "삭제";
//             prefix = "DELETE FROM daysmemo";
//             successMsg = "메모 전체가 삭제 되었습니다.";
//             failMsg = "메모 전체 삭제 실패";
//             params = [];
//             break;
//         case 'DELETE':
//             alertTitle = "삭제";
//             prefix = "DELETE FROM daysmemo WHERE created = ? ";
//             successMsg = today + " 메모가 삭제 되었습니다";
//             failMsg = today + " 메모 삭제 실패 ";
//             params = [today];
//             break;
//         default:
//             alert('sendQuery/No Types');
//             return;
//     }
//     try {
//         const retResults: any[] = [];
//         const res = await getDataFromDB(prefix, params);
//         const item = res?.rows?.item;
//         const rowslength = res?.rows?.length;
//         const rowsAffected = res?.rowsAffected;
//
//         if (rowslength > 0) {
//             for (let x = 0; x < rowslength; x++) {
//                 retResults.push(item(x));
//             }
//         };
//
//         switch (type) {
//             case 'GET' :
//                 return retResults[0];
//                 break;
//             case 'GET_MONTHLY' :
//                 return retResults;
//                 break;
//             case 'POST' :
//             case 'PUT' :
//             case 'DELETE' :
//             case 'DELETE_ALL' :
//                 (rowsAffected > 0) ? alertMaker(alertTitle, successMsg) : alertMaker(alertTitle, failMsg);
//                 return 'DONE';
//                 break;
//             default:
//                 console.log("sendQuery / type Error");
//                 break;
//         };
//
//     } catch (err) {
//         console.log("Try Database Error : ", err);
//     }
// };
//
// const getDataFromDB = async (prefix: string, params: any[]) => {
//     return new Promise((resolve, reject) => {
//         dbObj.transaction((tx) => {
//             dbObj.executeSql(prefix, params, async (res: any) => await resolve(res));
//         }).catch((err) => reject(err));
//     })
// };
// For Sqlite =================================================================== END
