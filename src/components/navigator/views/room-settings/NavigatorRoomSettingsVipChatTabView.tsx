import { RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText } from '../../../../api';
import { Column, Flex, Grid, Text } from '../../../../common';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsVipChatTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ chatDistance, setChatDistance ] = useState<number>(0);

    useEffect(() =>
    {
        setChatDistance(roomData.chatSettings.distance);
    }, [ roomData.chatSettings ]);

    return (
        <Flex column className="px-3">
            <Column className="pb-4" gap={ 0 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.vip.caption') }</Text>
                <Text fontSize={ 10 }>{ LocalizeText('navigator.roomsettings.vip.info') }</Text>
            </Column>
            <Column className="pb-3" gap={ 1 }>
                <Text fontSize={ 11 } bold>{ LocalizeText('navigator.roomsettings.vip_settings') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-form-check-input" type="checkbox" checked={ roomData.hideWalls } onChange={ event => handleChange('hide_walls', event.target.checked) } />
                    <Text fontSize={ 11 }>{ LocalizeText('navigator.roomsettings.hide_walls') }</Text>
                </Flex>
                <Flex className="pe-4" gap={ 1 } column>
                    <select className="w-100 form-select form-select-sm" value={ roomData.wallThickness } onChange={ event => handleChange('wall_thickness', event.target.value) }>
                        <option value="0">{ LocalizeText('navigator.roomsettings.wall_thickness.normal') }</option>
                        <option value="1">{ LocalizeText('navigator.roomsettings.wall_thickness.thick') }</option>
                        <option value="-1">{ LocalizeText('navigator.roomsettings.wall_thickness.thin') }</option>
                        <option value="-2">{ LocalizeText('navigator.roomsettings.wall_thickness.thinnest') }</option>
                    </select>
                    <select className="w-100 form-select form-select-sm" value={ roomData.floorThickness } onChange={ event => handleChange('floor_thickness', event.target.value) }>
                        <option value="0">{ LocalizeText('navigator.roomsettings.floor_thickness.normal') }</option>
                        <option value="1">{ LocalizeText('navigator.roomsettings.floor_thickness.thick') }</option>
                        <option value="-1">{ LocalizeText('navigator.roomsettings.floor_thickness.thin') }</option>
                        <option value="-2">{ LocalizeText('navigator.roomsettings.floor_thickness.thinnest') }</option>
                    </select>
                </Flex>
            </Column>
            <Column gap={ 2 }>
                <Text fontSize={ 11 } bold>{ LocalizeText('navigator.roomsettings.chat_settings') }</Text>
                <Text fontSize={ 11 }>{ LocalizeText('navigator.roomsettings.chat_settings.info') }</Text>
                <Flex className="pe-4" column gap={ 1 }>
                    <select className="w-100 form-select form-select-sm" value={ roomData.chatSettings.mode } onChange={ event => handleChange('bubble_mode', event.target.value) }>
                        <option value={ RoomChatSettings.CHAT_MODE_FREE_FLOW }>{ LocalizeText('navigator.roomsettings.chat.mode.free.flow') }</option>
                        <option value={ RoomChatSettings.CHAT_MODE_LINE_BY_LINE }>{ LocalizeText('navigator.roomsettings.chat.mode.line.by.line') }</option>
                    </select>
                    <select className="w-100 form-select form-select-sm" value={ roomData.chatSettings.weight } onChange={ event => handleChange('chat_weight', event.target.value) }>
                        <option value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL }>{ LocalizeText('navigator.roomsettings.chat.bubbles.width.normal') }</option>
                        <option value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN }>{ LocalizeText('navigator.roomsettings.chat.bubbles.width.thin') }</option>
                        <option value={ RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE }>{ LocalizeText('navigator.roomsettings.chat.bubbles.width.wide') }</option>
                    </select>
                    <select className="w-100 form-select form-select-sm" value={ roomData.chatSettings.speed } onChange={ event => handleChange('bubble_speed', event.target.value) }>
                        <option value={ RoomChatSettings.CHAT_SCROLL_SPEED_FAST }>{ LocalizeText('navigator.roomsettings.chat.speed.fast') }</option>
                        <option value={ RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL }>{ LocalizeText('navigator.roomsettings.chat.speed.normal') }</option>
                        <option value={ RoomChatSettings.CHAT_SCROLL_SPEED_SLOW }>{ LocalizeText('navigator.roomsettings.chat.speed.slow') }</option>
                    </select>
                    <select className="w-100 form-select form-select-sm" value={ roomData.chatSettings.protection } onChange={ event => handleChange('flood_protection', event.target.value) }>
                        <option value={ RoomChatSettings.FLOOD_FILTER_LOOSE }>{ LocalizeText('navigator.roomsettings.chat.flood.loose') }</option>
                        <option value={ RoomChatSettings.FLOOD_FILTER_NORMAL }>{ LocalizeText('navigator.roomsettings.chat.flood.normal') }</option>
                        <option value={ RoomChatSettings.FLOOD_FILTER_STRICT }>{ LocalizeText('navigator.roomsettings.chat.flood.strict') }</option>
                    </select>
                </Flex>
                <Flex gap={ 1 } alignItems="center">
                    <input type="number" min="0" style={ { width: 35 } } className="form-control form-control-sm" value={ chatDistance } onChange={ event => setChatDistance(event.target.valueAsNumber) } onBlur={ event => handleChange('chat_distance', chatDistance) } />
                    <Text fontSize={ 11 }>{ LocalizeText('navigator.roomsettings.chat_settings.hearing.distance') }</Text>
                </Flex>
            </Column>
        </Flex>
    );
}
