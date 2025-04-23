import {
    AddFavouriteRoomMessageComposer,
    DeleteFavouriteRoomMessageComposer,
    RoomDataParser,
    RoomSettingsComposer,
    UpdateHomeRoomMessageComposer
} from '@nitrots/nitro-renderer';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import {
    GetGroupInformation,
    GetSessionDataManager, GetUserProfile,
    LocalizeText,
    ReportType,
    SendMessageComposer,
    ToggleFavoriteGroup, ToggleFavoriteRoom
} from '../../../../api';
import {
    Base,
    classNames,
    Column,
    Flex,
    LayoutBadgeImageView,
    LayoutRoomThumbnailView,
    NitroCardContentView,
    Text,
    UserProfileIconView
} from '../../../../common';
import { useHelp, useNavigator } from '../../../../hooks';

interface NavigatorSearchResultItemInfoViewProps
{
    roomData: RoomDataParser;
}

export const NavigatorSearchResultItemInfoView: FC<NavigatorSearchResultItemInfoViewProps> = (props) =>
{
    const { roomData = null } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();
    const { navigatorData = null, favouriteRoomIds = [] } = useNavigator();
    const { report = null } = useHelp();

    useEffect(() => 
    {
        // add when mounted
        document.addEventListener('mousedown', handleClick);
        // return function to be called when unmounted
        return () => 
        {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleClick = e =>
    {
        const popover = document.querySelector('.room-info');

        if (elementRef.current?.contains(e.target) || popover?.contains(e.target))
        {
            return;
        }

        setIsVisible(false);
    };

    const getTradeModeText = (): string => 
    {
        if (roomData.tradeMode === 0) return LocalizeText('trading.mode.not.allowed');
        if (roomData.tradeMode === 1) return LocalizeText('trading.mode.free');
        return LocalizeText('trading.mode.not.allowed');
    };

    const processAction = (action: string, value?: string) => 
    {
        if (!navigatorData || !navigatorData.enteredGuestRoom) return;

        switch (action) 
        {
            case 'set_home_room':
                let newRoomId = -1;

                if (navigatorData.homeRoomId !== roomData.roomId) 
                {
                    newRoomId = roomData.roomId;
                }

                if (newRoomId > 0) SendMessageComposer(new UpdateHomeRoomMessageComposer(newRoomId));
                return;
            case 'open_room_settings':
                SendMessageComposer(new RoomSettingsComposer(roomData.roomId));
                return;
            case 'report_room':
                setIsVisible(false)
                report(ReportType.ROOM, { roomId: roomData.roomId, roomName: roomData.roomName });
                return;
            case 'room_favourite':
                const isFavorite = favouriteRoomIds.includes(roomData.roomId);
                ToggleFavoriteRoom(roomData.roomId, isFavorite);
                return;
            case 'user_profile':
                setIsVisible(false)
                GetUserProfile(roomData.ownerId);
                return;
            case 'group':
                setIsVisible(false)
                GetGroupInformation(roomData.habboGroupId);
                return;
        }
    }

    return (
        <>
            <Base pointer innerRef={ elementRef } className="icon icon-navigator-info" onClick={ event => 
            {
                isVisible ? setIsVisible(false) : setIsVisible(true);
                event.stopPropagation();
            } }/>
            <Overlay show={ isVisible } target={ elementRef.current } placement="right">
                <Popover>
                    <NitroCardContentView onClick={ event => event.stopPropagation() } overflow="hidden" className="room-info bg-transparent">
                        <Flex gap={ 2 } overflow="hidden" className="room-info-bg p-2">
                            <LayoutRoomThumbnailView roomId={ roomData.roomId }
                                customUrl={ roomData.officialRoomPicRef }
                                className="d-flex flex-column align-items-center justify-content-end mb-1">
                                { roomData.habboGroupId > 0 && (
                                    <LayoutBadgeImageView badgeCode={ roomData.groupBadgeCode } isGroup={ true }
                                        className={ 'position-absolute top-0 start-0 m-1 ' }/>) }
                                { roomData.doorMode !== RoomDataParser.OPEN_STATE && (
                                    <i className={ 'position-absolute end-0 mb-1 me-1 icon icon-navigator-room-' + (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? 'locked' : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? 'password' : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? 'invisible' : '') }/>) }
                            </LayoutRoomThumbnailView>
                            <Column gap={ 1 }>
                                <Text bold truncate className="flex-grow-1" style={ { maxHeight: 13 } }>
                                    { roomData.roomName }
                                </Text>
                                <Text className="flex-grow-1">
                                    { roomData.description }
                                </Text>
                            </Column>
                        </Flex>
                        <Column>
                            <Flex>
                                <Flex pointer onClick={ () => processAction('user_profile') } gap={ 1 } className="align-items-center">
                                    <UserProfileIconView onClick={ () => processAction('user_profile') } userId={ roomData.ownerId }/>
                                    <Text bold underline>{ roomData.ownerName }</Text>
                                </Flex>
                                { roomData.habboGroupId !== 0 &&
                                    <Flex onClick={ () => processAction('group') } pointer gap={ 1 } className="align-items-center" justifyContent="end" fullWidth>
                                        <i className="icon icon-navigator-room-group"/>
                                        <Text bold underline>{ roomData.groupName }</Text>
                                    </Flex>
                                }
                            </Flex>
                            <Flex gap={ 5 } fullWidth>
                                <Column className="w-50">
                                    <Flex gap={ 3 }>
                                        <Text bold>{ LocalizeText('navigator.roompopup.property.trading') }</Text>
                                        <Text>{ getTradeModeText() }</Text>
                                    </Flex>
                                    <Flex gap={ 4 }>
                                        <Text bold>{ LocalizeText('navigator.roompopup.property.max_users') }</Text>
                                        <Text className="ms-1">{ roomData.maxUserCount }</Text>
                                    </Flex>
                                </Column>
                                <Column alignItems="start" gap={ 1 } justifyContent="center" alignSelf="center"
                                    className="w-50">
                                    <Flex pointer justifyContent="center"
                                        onClick={ () => processAction('room_favourite') } gap={ 2 }
                                        alignItems="center">
                                        <i className={ `icon icon-navigator-favorite-room ${ favouriteRoomIds.includes(roomData.roomId) ? 'active' : '' }` }/>
                                        <Text
                                            align="center">{ LocalizeText('navigator.room.popup.room.info.favorite') }</Text>
                                    </Flex>
                                    <Flex pointer justifyContent="center" alignItems="center"
                                        onClick={ () => processAction('set_home_room') } gap={ 2 }>
                                        <i className={ classNames('icon icon-navigator-my-room', ((navigatorData.homeRoomId !== roomData.roomId) && 'active')) }/>
                                        <Text
                                            align="center">{ LocalizeText('navigator.room.popup.room.info.home') }</Text>
                                    </Flex>
                                    { GetSessionDataManager().userId === roomData.ownerId &&
                                            <Flex pointer gap={ 2 } onClick={ () => processAction('open_room_settings') }
                                                justifyContent="center" alignItems="center">
                                                <i className="icon icon-navigator-room-settings"/>
                                                <Text
                                                    align="center">{ LocalizeText('navigator.room.popup.info.room.settings') }</Text>
                                            </Flex>
                                    }
                                    { GetSessionDataManager().userId !== roomData.ownerId &&
                                            <Flex pointer gap={ 2 } onClick={ () => processAction('report_room') }
                                                justifyContent="center" alignItems="center">
                                                <i className="icon icon-navigator-room-report"/>
                                                <Text
                                                    align="center">{ LocalizeText('navigator.room.popup.report.room') }</Text>
                                            </Flex>
                                    }
                                </Column>
                            </Flex>
                            { roomData.tags && roomData.tags.length > 0 &&
                                    <Flex gap={ 1 }>
                                        <Text variant="white"
                                            className="bg-flash-orange p-1">#{ roomData.tags && roomData.tags.length > 1 ? roomData.tags[1] : '' }</Text>
                                        <Text variant="white" className="bg-flash-orange p-1">#{ roomData.tags }</Text>
                                    </Flex>
                            }
                        </Column>
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
}