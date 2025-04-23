import { SendMessageComposer } from '..';
import {
    DeleteFavouriteRoomMessageComposer,
    AddFavouriteRoomMessageComposer
} from '@nitrots/nitro-renderer';


export const ToggleFavoriteRoom = (roomId: number, isFavorite: boolean) =>
{
    SendMessageComposer(isFavorite ? new DeleteFavouriteRoomMessageComposer(roomId) : new AddFavouriteRoomMessageComposer(roomId));
}
