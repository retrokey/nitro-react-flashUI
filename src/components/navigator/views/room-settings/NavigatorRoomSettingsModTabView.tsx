import { BannedUserData, BannedUsersFromRoomEvent, RoomBannedUsersComposer, RoomModerationSettings, RoomUnbanUserComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, Grid, Text, UserProfileIconView } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsModTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ selectedUserId, setSelectedUserId ] = useState<number>(-1);
    const [ bannedUsers, setBannedUsers ] = useState<BannedUserData[]>([]);

    const unBanUser = (userId: number) =>
    {
        setBannedUsers(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const index = newValue.findIndex(value => (value.userId === userId));

            if(index >= 0) newValue.splice(index, 1);

            return newValue;
        })

        SendMessageComposer(new RoomUnbanUserComposer(userId, roomData.roomId));

        setSelectedUserId(-1);
    }

    useMessageEvent<BannedUsersFromRoomEvent>(BannedUsersFromRoomEvent, event =>
    {
        const parser = event.getParser();

        if(!roomData || (roomData.roomId !== parser.roomId)) return;

        setBannedUsers(parser.bannedUsers);
    });

    useEffect(() =>
    {
        SendMessageComposer(new RoomBannedUsersComposer(roomData.roomId));
    }, [ roomData.roomId ]);

    return (
        <Flex className="px-2" gap={ 2 } column overflow="auto">
            <Text fontSize={ 6 }>{ LocalizeText('navigator.roomsettings.moderation.header') }</Text>
            <Column>
                <Column gap={ 1 }>
                    <Text fontSize={ 11 } bold>{ LocalizeText('navigator.roomsettings.moderation.mute.header') }</Text>
                    <Flex className="pe-5" alignItems="center" gap={ 1 }>
                        <select className="w-100 form-select form-select-sm" value={ roomData.moderationSettings.allowMute } onChange={ event => handleChange('moderation_mute', event.target.value) }>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText('navigator.roomsettings.moderation.none') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText('navigator.roomsettings.moderation.rights') }
                            </option>
                        </select>
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text fontSize={ 11 } bold>{ LocalizeText('navigator.roomsettings.moderation.kick.header') }</Text>
                    <Flex className="pe-5" alignItems="center" gap={ 1 }>
                        <select className="w-100 form-select form-select-sm" value={ roomData.moderationSettings.allowKick } onChange={ event => handleChange('moderation_kick', event.target.value) }>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText('navigator.roomsettings.moderation.none') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText('navigator.roomsettings.moderation.rights') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_ALL }>
                                { LocalizeText('navigator.roomsettings.moderation.all') }
                            </option>
                        </select>
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text fontSize={ 11 } bold>{ LocalizeText('navigator.roomsettings.moderation.ban.header') }</Text>
                    <Flex className="pe-5" alignItems="center" gap={ 1 }>
                        <select className="w-100 form-select form-select-sm" value={ roomData.moderationSettings.allowBan } onChange={ event => handleChange('moderation_ban', event.target.value) }>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_NONE }>
                                { LocalizeText('navigator.roomsettings.moderation.none') }
                            </option>
                            <option value={ RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS }>
                                { LocalizeText('navigator.roomsettings.moderation.rights') }
                            </option>
                        </select>
                    </Flex>
                </Column>
            </Column>
            <Column>
                <Grid alignItems="center" gap={ 1 }>
                    <Column size={ 7 } overflow="hidden" className="bg-white border rounded list-container p-2">
                        <Column fullWidth overflow="auto" gap={ 1 }>
                            { bannedUsers && (bannedUsers.length > 0) && bannedUsers.map((user, index) =>
                            {
                                return (
                                    <Flex key={ index } shrink alignItems="center" gap={ 1 } overflow="hidden">
                                        <UserProfileIconView userName={ user.userName } />
                                        <Text pointer grow onClick={ event => setSelectedUserId(user.userId) }> { user.userName }</Text>
                                    </Flex>
                                );
                            }) }
                        </Column>
                    </Column>
                    <Column justifyContent="center" alignItems="center" size={ 5 } >
                        <Text fontSize={ 10 }>{ LocalizeText('navigator.roomsettings.moderation.banned.users') } ({ bannedUsers.length })</Text>
                        <Button onClick={ event => unBanUser(selectedUserId) }>
                            { LocalizeText('navigator.roomsettings.moderation.unban') } { selectedUserId > 0 && bannedUsers.find(user => (user.userId === selectedUserId))?.userName }
                        </Button>
                    </Column>
                </Grid>
            </Column>
        </Flex>
    );
}
