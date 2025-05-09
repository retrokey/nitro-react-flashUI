import { FC, useEffect, useState } from 'react';
import { AvatarEditorGridPartItem, GetConfiguration } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';
import { AvatarEditorIcon } from '../AvatarEditorIcon';

export interface AvatarEditorFigureSetItemViewProps extends LayoutGridItemProps
{
    partItem: AvatarEditorGridPartItem;
}

export const AvatarEditorFigureSetItemView: FC<AvatarEditorFigureSetItemViewProps> = props =>
{
    const { partItem = null, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const hcDisabled = GetConfiguration<boolean>('hc.disabled', false);

    useEffect(() =>
    {
        const rerender = () => setUpdateId(prevValue => (prevValue + 1));

        partItem.notify = rerender;

        return () => partItem.notify = null;
    }, [ partItem ]);

    return (
        <div className={ `avatar-container avatar-parts ${ partItem.isSelected ? 'part-selected' : '' }` }>
            <LayoutGridItem className="avatar-parts-item-container" itemImage={ (partItem.isClear ? undefined : partItem.imageUrl) } { ...rest }>
                { !hcDisabled && partItem.isHC && <i className="icon hc-icon position-absolute" /> }
                { partItem.isClear && <AvatarEditorIcon icon="clear" /> }
                { partItem.isSellable && <AvatarEditorIcon icon="sellable" position="absolute" className="end-1 bottom-1" /> }
                { children }
            </LayoutGridItem>
        </div>
    );
}
