import { HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { AvatarEditorGridPartItem, CategoryData, CreateLinkEvent, GetSessionDataManager, IAvatarEditorCategoryModel } from '../../../../api';
import { AutoGrid } from '../../../../common';
import { AvatarEditorFigureSetItemView } from './AvatarEditorFigureSetItemView';

export interface AvatarEditorFigureSetViewProps
{
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    setMaxPaletteCount: Dispatch<SetStateAction<number>>;
}

export const AvatarEditorFigureSetView: FC<AvatarEditorFigureSetViewProps> = props =>
{
    const { model = null, category = null, setMaxPaletteCount = null } = props;
    const elementRef = useRef<HTMLDivElement>(null);

    const selectPart = useCallback((item: AvatarEditorGridPartItem) =>
    {
        const index = category.parts.indexOf(item);

        if(index === -1) return;

        if (item.isHC && GetSessionDataManager().clubLevel === HabboClubLevelEnum.NO_CLUB) return CreateLinkEvent('habboUI/open/hccenter');

        model.selectPart(category.name, index);

        const partItem = category.getCurrentPart();

        setMaxPaletteCount(partItem.maxColorIndex || 1);
    }, [ model, category, setMaxPaletteCount ]);

    useEffect(() =>
    {
        if(!model || !category || !elementRef || !elementRef.current) return;

        elementRef.current.scrollTop = 0;
    }, [ model, category ]);

    return (
        <AutoGrid className="clothing-container" innerRef={ elementRef } columnCount={ 3 } columnMinHeight={ 50 }>
            { (category.parts.length > 0) && category.parts.map(item =>
                <AvatarEditorFigureSetItemView key={ item.id } partItem={ item } onClick={ event => selectPart(item) } />)
            }
        </AutoGrid>
    );
}
