import { setDefaults } from './defaults'
import { validateAddress } from './functions/address_validators'
import { validateCard } from './functions/card_validators'
import { validateDate } from './functions/date_validators'
import { validateEmail } from './functions/email_validators'
import { validateIPAddress } from './functions/ip_validators'
import {validateName} from './functions/name_validators'
import { validatePassword } from './functions/password_validators'
import { validatePhone } from './functions/phone_validators'
import { validateUsername } from './functions/username_validators'

export default {
    defaults: setDefaults,
    name: validateName,
    email: validateEmail,
    address: validateAddress,
    phone: validatePhone,
    password: validatePassword,
    ip: validateIPAddress,
    username: validateUsername,
    date: validateDate,
    card: validateCard,
}