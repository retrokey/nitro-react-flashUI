import { FC, useMemo } from 'react';
import { GetConfiguration } from '../../api';
import { Base, BaseProps } from '../Base';

export interface LayoutRoomThumbnailViewProps extends BaseProps<HTMLDivElement>
{
    roomId?: number;
    customUrl?: string;
}

export const LayoutRoomThumbnailView: FC<LayoutRoomThumbnailViewProps> = props =>
{
    const { roomId = -1, customUrl = null, shrink = true, overflow = 'hidden', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'room-thumbnail', 'border' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const getImageUrl = useMemo(() =>
    {
        if(customUrl && customUrl.length) return (GetConfiguration<string>('image.library.url') + customUrl);

        return (GetConfiguration<string>('thumbnails.url').replace('%thumbnail%', roomId.toString()));
    }, [ customUrl, roomId ]);

    return (
        <Base shrink={ shrink } overflow={ overflow } classNames={ getClassNames } { ...rest }>
            { getImageUrl && <img alt="" src={ `${ getImageUrl }?${ Date.now() }` } /> }
            { children }
        </Base>
    );
}
