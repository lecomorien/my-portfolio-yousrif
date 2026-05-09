"use client";
import CreatableSelect from "react-select/creatable";
import { useEffect, useState } from "react";
import { TechnologiesQuery } from "@/lib/queries/technologies";

type Option = {
  value: string;
  label: string;
};

/* type Props = {
  onChange: (values: Option[]) => void;
}; */
interface Props {
  value?: Option[];
  onChange: (value: Option[]) => void;
}

export default function TechMultiSelect({ value, onChange }: Props) {
  const [options, setOptions] = useState<Option[]>([]);
  //const [value, setValue] = useState<Option[]>([]);

  useEffect(() => {
    const fetchTechs = async () => {
      const data = await TechnologiesQuery.getAll();
      setOptions(
        data.map((t) => ({
          value: t.id,
          label: t.name,
        }))
      );
    };

    fetchTechs();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (selected: any) => {
    //setValue(selected);
    onChange(selected);
  };

  const handleCreate = async (inputValue: string) => {
    const newTech = await TechnologiesQuery.create(inputValue);

    const newOption = {
      value: newTech.id,
      label: newTech.name,
    };

    setOptions((prev) => [...prev, newOption]);
    //setValue((prev) => [...prev, newOption]);

    onChange([...(value || []), newOption]);
  };

  return (
    <CreatableSelect
      isMulti
      options={options}
      value={value}
      onChange={handleChange}
      onCreateOption={handleCreate}
      isClearable
      isSearchable
      placeholder="Select or create technologies..."
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatCreateLabel={(input: any) => `Create "${input}"`}
      allowCreateWhileLoading
      createOptionPosition="first"
    />
  );
}