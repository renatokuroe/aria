declare module 'react-input-mask' {
    import React from 'react'

    interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
        mask?: string | (string | RegExp)[]
        maskChar?: string
        beforeMaskedValueChange?: (newState: any, oldState: any, newValue: string) => any
        alwaysShowMask?: boolean
    }

    const InputMask: React.ForwardRefExoticComponent<InputMaskProps & React.RefAttributes<HTMLInputElement>>
    export default InputMask
}
