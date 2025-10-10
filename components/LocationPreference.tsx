import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Select } from './ui/select';
import { MapPinIcon } from './ui/Icons';

export default function LocationPreference({ location, setLocation }: { location: string, setLocation: (val: string) => void }) {
  const locationOptions = [
    { label: 'USA', value: 'usa' },
    { label: 'INDIA', value: 'india' },
    { label: 'Global', value: 'global' },
  ];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
      <MapPinIcon size={22} color="#2563eb" style={{ marginRight: 8 }} />
      <Text style={{ fontSize: 14, color: '#2563eb', fontWeight: '500', marginRight: 4 }}>Location:</Text>
      <Select
        options={locationOptions}
        value={location}
        onValueChange={setLocation}
        placeholder={'Select location'}
        style={{ minWidth: 90, maxWidth: 140, backgroundColor: '#f8fafc', borderColor: '#dbeafe', borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6 }}
      />
    </View>
  );
}
