// const sections = React.useMemo(() => {
//   const sectionsMap = contactsList.reduce(
//     (acc: { [key: string]: PhoneContacts.Contact[] }, contact) => {
//       let firstLetter = contact.name
//         ? contact.name.charAt(0).toUpperCase()
//         : "#";
//       if (!firstLetter.match(/[A-Z]/)) {
//         firstLetter = "#";
//       }
//       return { ...acc, [firstLetter]: [...(acc[firstLetter] || []), contact] };
//     },
//     {}
//   );

//   return Object.entries(sectionsMap)
//     .map(([letter, items]) => ({
//       letter,
//       items,
//     }))
//     .sort((a, b) => a.letter.localeCompare(b.letter));
// }, [contactsList]);
