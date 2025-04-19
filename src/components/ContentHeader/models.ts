import React from 'react'

export interface IContentHeader {
    title: string,
    showBtn: boolean,
    redirectPath: string,
    buttonText: string,
    showIcon?: boolean,
    Icon?: React.FC<any>
}