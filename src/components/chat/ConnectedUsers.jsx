const ConnectedUsers = ({ connectedUsers, loggedUser }) => {
  const loggedUserId = String(loggedUser._id || loggedUser.id);

  // Filtramos los usuarios que no son el logueado
  const otherUsers = connectedUsers.filter(
    user => String(user.id || user._id) !== loggedUserId
  );

  // Tomamos solo los primeros nombres
  const otherNames = otherUsers.map(
    user => user.fullName?.split(" ")[0] || "Usuario"
  );

  // Preparamos la cadena final
  const displayNames =
    otherNames.length === 0
      ? "Tú"
      : `${otherNames.join(", ")} y Tú`;

  return (
    <p className="text-neutral-700 dark:text-neutral-300 text-xs">
      {displayNames}
    </p>
  );
};

export default ConnectedUsers;
