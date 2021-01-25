/**
 * Created by RoryHe on 2021/1/25.
 */
import {apiGET, apiPOST, downLoadGET} from './server'

export const BASE_URL = location.protocol + "//" + location.hostname + ':' + location.port
export let BASE_REDIRECT_URL = BASE_URL
export let BASE_SERVER = `${BASE_URL}`//请求主地址test
