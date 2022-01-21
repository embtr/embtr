import * as React from 'react';
import { TextCard } from 'src/components/common/timeline/TextCard';

interface Props {
    title: string,
    body: string,
}

export const EmbtrTextCard = ({ title, body }: Props) => {
    return <TextCard staticImage={require('assets/logo.png')} name={"embtr."} title={title} body={body} />
}